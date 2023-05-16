"use strict";

const startWorker = require('./worker');

/**
 * Start a message queue worker.
 * @param {Function} worker  
 * @param {*} queueService 
 * @param {*} queueName  
 * @param {object} options 
 */
async function startQueueWorker(worker, queueService, queueName, options) {    
    let { workerName, ...workerOptions } = options;

    if (!workerName) {
        workerName = queueName + 'Worker';
    }  

    return startWorker(async (app) => {
        let messageQueue = app.getService(queueService);

        app.log('info', `A queue worker is started and waiting for message on queue "${queueName}" ...`);

        await messageQueue.workerConsume_(queueName, (channel, msg) => {            
            let info = msg && msg.content;

            try {
                info = info && JSON.parse(info.toString());
            } catch (error) {
                app.log('error', 'The incoming message is not a valid JSON string.');
                channel.ack(msg);  
                return;
            }

            if (info && info.$mock) {
                app.log('info', 'A mock message is received.\nMessage: ' + raw);
                channel.ack(msg);  
                return;
            }

            worker(app, info).then(shouldAck => {
                if (shouldAck) {                    
                    channel.ack(msg);  
                } else {
                    channel.nack(msg);  
                }                    
            }).catch(error => {
                app.log('error', error.message, { ...error.info, stack: error.stack });

                if (error.needRetry) {
                    channel.nack(msg);  
                } else {
                    channel.ack(msg);
                } 
            });            
        });

    }, { ...workerOptions, workerName, dontStop: true });
}

module.exports = startQueueWorker;
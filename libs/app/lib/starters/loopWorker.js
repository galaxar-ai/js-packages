const { sleep_ } = require('@genx/july');
const startWorker = require('./worker');

/**
 * 
 * @param {Function} worker 
 * @param {object} options 
 * @property {integer} [options.interval=1000]
 */
async function startLoopWorker(worker, options) {
    let { interval, ...workerOptions } = options;

    if (typeof interval === 'undefined') {
        interval = 1000;
    }

    return startWorker(async (app) => {             
        while (true) {
            await worker(app);
            await sleep_(interval);
        }            
    }, workerOptions);
}

module.exports = startLoopWorker;
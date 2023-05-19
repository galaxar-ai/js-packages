//amqps://rabbitmq:Nc187CQhOFT4@b-b42f7e4e-9668-4c0a-9ee6-54b6bd940739.mq.ap-southeast-1.amazonaws.com:5671

import { startWorker } from '../lib';

describe('starters:worker', function () {
    it('start', async function () {
        let a = 2;

        await startWorker(
            () => {
                console.log('work');
                a += 1;
            },
            {
                initializer: (app) => {
                    console.log('init');
                    a *= app.settings.num; // 10
                },
                loadConfigFromOptions: true,
                config: {
                    settings: {
                        num: 5,
                    },
                },
            }
        );

        a.should.be.exactly(11);
    });
});

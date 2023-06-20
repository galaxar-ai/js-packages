import { startWorker } from '@galaxar/app';

startWorker(
    async (app) => {
        const worker = app.getService('threadWorker');

        const handlers = {
            async hashFile({ file, encoding, algorithm }) {
                const hasher = app.getService('cipher');
                const value = await hasher.hashFile_(file, encoding, algorithm);
                return {
                    value,
                    //transferList: [ value ]
                };
            },

            probe() {
                return { value: worker.perfCounter };
            },
        };

        worker.start(handlers);
    },
    {
        logLevel: 'verbose',
        configName: 'thread-worker',
        dontStop: true,
    }
);

import { sleep_ } from '@galaxar/utils';
import { startWorker } from '@galaxar/app';

describe('ttlcache', function () {
    it('test case 1', async function () {
        await startWorker(async (app) => {
            const cache = app.getService('ttlMemCache');
            should.exist(cache);
            const obj = { my: 'Special', variable: 42 };
            const success = cache.set('myKey', obj);

            success.should.be.ok();

            const obj2 = cache.get('myKey');
            (obj === obj2).should.be.ok();
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });

    it('test case 2', async function () {
        await startWorker(async (app) => {
            const cache = app.getService('ttlMemCache');
            should.exist(cache);
            const obj = { my: 'Special', variable: 42 };
            const success = cache.set('myKey', obj, 1);
            success.should.be.ok();

            await sleep_(10000);

            const obj2 = cache.get('myKey');
            should.not.exist(obj2);
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });
});

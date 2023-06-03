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

            await sleep_(3000);

            const obj2 = cache.get('myKey');
            should.not.exist(obj2);
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });

    it('test case 3', async function () {
        await startWorker(async (app) => {
            const cache = app.getService('ttlMemCache');

            should.not.exist(cache.get('myKey'));
            
            const value = await cache.get_('myKey', async () => {
                await sleep_(100);
                return 'myValue';
            }, 10000);

            value.should.equal('myValue');
            cache.get('myKey').should.equal('myValue');
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });
});

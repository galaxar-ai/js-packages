import path from 'node:path';
import { startWorker } from '@galaxar/app';

const imageFile = path.resolve(__dirname, './files/logo.png');

describe('hasher', function () {
    it('test case 1', async function () {
        await startWorker(async (app) => {
            const hasher = app.getService('cipher');
            should.exist(hasher);

            const hash = await hasher.hashFile_(imageFile, 'hex', 'md5');
            hash.should.be.exactly('3349b8205d8c682a3d246d8b0d07635f');
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });
});

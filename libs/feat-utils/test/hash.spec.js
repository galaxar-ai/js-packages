import path from 'node:path';
import { startWorker } from '@galaxar/app';

const imageFile = path.resolve(__dirname, './files/logo.png');

describe('hasher', function () {
    it('test case 1', async function () {
        await startWorker(async (app) => {
            const hasher = app.getService('hasher');
            should.exist(hasher);

            const hash1 = await hasher.async("ejoifjiaowfewjfioaewfjwofewoj", { encoding: 'hex', algorithm: 'sha256' });

            hash1.should.be.exactly('34197c85d8d1296b642ee567dcfe4d39462c47ebda6b83538e45f4b015b52bc0');

            const hash = await hasher.fromFile(imageFile, { algorithm: 'md5' });
            hash.should.be.exactly('3349b8205d8c682a3d246d8b0d07635f');
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });
});

import { startWorker } from '@galaxar/app';

describe('cipher', function () {
    it('test case 1', async function () {
        await startWorker(async (app) => {
            const cipher = app.getService('cipher');      
            
            const hash1 = await cipher.hash("ejoifjiaowfewjfioaewfjwofewoj", '');
            hash1.should.be.exactly('34197c85d8d1296b642ee567dcfe4d39462c47ebda6b83538e45f4b015b52bc0');    

            const password = 'iofjewojofafe';

            const encrypted = cipher.encrypt(password);

            const _password = cipher.decrypt(encrypted);

            password.should.be.eql(_password);
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });
});

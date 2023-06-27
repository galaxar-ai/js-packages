import path from 'node:path';
import { startWorker } from '@galaxar/app';
import { sleep_ } from '@galaxar/utils';

const imageFile = path.resolve(__dirname, './files/logo.png');

describe('thread', function () {
    it('hashFile', async function () {
        await startWorker(async (app) => {
            const threadPool = app.getService('threadPool');      
            
            const result = await threadPool.runTask_('hashFile', {
                file: imageFile, 
                encoding: 'hex', 
                algorithm: 'md5'
            });           
            
            result.should.be.exactly('3349b8205d8c682a3d246d8b0d07635f');

            const perf = await threadPool.runTask_('probe');    
            console.log(perf);
        }, {
            workingPath: "test",
            configName: 'thread-pool',
            //logLevel: "debug"
        });
    });

    it('callback', async function () {
        await startWorker(async (app) => {
            const threadPool = app.getService('threadPool');  

            let futureNotice = null;
            
            threadPool.setCallbackHandlers({
                futureNotice: async (msg) => {
                    futureNotice = msg;
                }
            })
            
            const result = await threadPool.runTask_('someTaskWithFutureCb', {
                name: 'John'
            });      
            
            console.log(result);
            
            result.should.be.exactly('Hello John');

            await sleep_(2000);

            futureNotice.should.be.exactly('Hi from future');
        }, {
            workingPath: "test",
            configName: 'thread-pool',
            //logLevel: "debug"
        });
    });
});

import { startWorker } from '@galaxar/app';

await startWorker(async (app) => {
    const cipher = app.getService('cipher');      
    const pair = cipher.generateKeyPair();

    console.log(pair);
    
}, {
    workingPath: "test",
    //logLevel: "debug"
});
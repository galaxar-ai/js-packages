/**
 * Module dependencies.
 */

import path from "node:path";
import WebServer from "..";

const WORKING_DIR = path.resolve(__dirname, 'fixtures/app-bvt');

const webServer = new WebServer('test server', { 
    workingPath: WORKING_DIR,
    logLevel: 'debug',
});

webServer.start_().catch((error) => {
    console.error(error);
});
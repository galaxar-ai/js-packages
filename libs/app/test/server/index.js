/**
 * Module dependencies.
 */

import WebServer from '@galaxar/server';
import { esmIsMain } from '@galaxar/utils';

const createServer = (name, opts) => {
    return new WebServer(name, opts);
};

if (esmIsMain() || require.main === module) {
    const webServer = createServer('test', {
        logLevel: 'verbose',
        //sourcePath: process.env.SVR_SRC_PATH ?? 'server',
    });

    webServer
        .start_()
        .catch((error) => {
            console.error(error);
        });
}

export default createServer;

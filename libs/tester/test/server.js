/**
 * Module dependencies.
 */

import WebServer from '@galaxar/server';
import { esmIsMain } from '@galaxar/utils';

const createServer = (name, opts) => {
    return new WebServer(name, {
        configPath: 'test/conf',
        controllersPath: 'test/actions',
        logLevel: 'debug',
        ...opts,
    });
};

if (esmIsMain() || require.main === module) {
    const webServer = createServer('test server');
    webServer.start_().catch((error) => {
        console.error(error);
    });
}

export default createServer;

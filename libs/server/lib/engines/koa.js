import http from 'node:http';
import Koa from 'koa';
import mount from 'koa-mount';
import { _, toBoolean } from '@galaxar/utils';
import { InvalidConfiguration } from '@galaxar/types';

class KoaEngine {
    constructor(server) {
        this.server = server;
        this.engine = new Koa();

        if (this.server.runnable) {
            this.server.on('configFinalized', (config) => {
                const koaConfig = config.koa;

                this._initialize({ ...koaConfig });

                delete config.koa;
            });
        }
    }

    _initialize(options) {
        const koa = this.engine;
        const server = this.server;
        koa.proxy = options.trustProxy && toBoolean(options.trustProxy);

        if (options.subdomainOffset != null) {
            if (options.subdomainOffset < 2) {
                throw new InvalidConfiguration(
                    'Invalid subdomainOffset. Should be larger or equal to 2.',
                    this.server,
                    'koa.subdomainOffset'
                );
            }

            koa.subdomainOffset = options.subdomainOffset;
        }

        if (options.keys) {
            koa.keys = _.castArray(options.keys);
        }

        koa.on('error', (err, ctx) => {
            const info = { err, app: ctx.appModule.name };

            if (err.status && err.status < 500) {
                if (ctx.log) {
                    ctx.log.warn(info);
                } else {
                    ctx.appModule.log('warn', 'REQUEST ERROR', info);
                }

                return;
            }

            if (ctx.log) {
                ctx.log.error(info);
            } else {
                ctx.appModule.log('error', 'SERVER ERROR', info);
            }
        });

        server.httpServer = http.createServer(koa.callback());

        let port = options.httpPort || 2331;

        server.on('ready', () => {
            server.httpServer.listen(port, function (err) {
                if (err) throw err;

                let address = server.httpServer.address();

                let host;
                if (address.family === 'IPv6' && address.address === '::') {
                    host = '127.0.0.1';
                } else {
                    host = address.address;
                }

                server.host = `${host}:${address.port}`;
                server.port = address.port;

                server.log('info', `A http service is listening on port [${address.port}] ...`);
                /**
                 * Http server ready event
                 * @event WebServer#httpReady
                 */
                server.emit_('httpReady', server);
            });
        });
    }

    use(middleware) {
        this.engine.use(middleware);
    }

    mount(route, subEngine) {
        this.engine.use(mount(route, subEngine.engine));
    }

    middleware(fn) {
        return fn;
    }
}

export default KoaEngine;

import Koa from 'koa';
import mount from 'koa-mount';
import { _, toBoolean } from '@galaxar/utils';

class KoaEngine {
    constructor(server) {
        this.server = server;
        this.engine = new Koa();

        console.log('feiojfioajfiewajiofjo');

        if (this.server.runnable) {
            console.log('8888888');

            this.server.on('configFinalized', (config) => {
                console.log('foiejfieaofjoefoj');
                const koaConfig = config.koa;

                if (!koaConfig) {
                    throw new InvalidConfiguration('Missing koa config.', this.server, 'koa');
                }

                this._initialize(koaConfig);

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
            let extra = _.pick(err, ['status', 'code', 'info']);

            if (ctx) {
                extra.request = _.pick(ctx, ['method', 'url', 'ip']);
            }

            extra.app = ctx.appModule.name;

            if (err.status && err.status < 500) {
                if (server.env === 'development') {
                    extra.stack = err.stack;
                }
                server.log('warn', `[${err.status}] ` + err.message, extra);
                return;
            }

            server.logError(err);
        });

        server.httpServer = require('http').createServer(koa.callback());

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
        this.engine.use(mount(route, subEngine));
    }

    middleware(fn) {
        return fn;
    }
}

export default KoaEngine;

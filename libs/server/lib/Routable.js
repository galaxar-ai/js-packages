import path from 'node:path';
import { fs, isDir } from '@galaxar/sys';
import { globSync } from 'glob';
import { _, url as urlUtil, text } from '@galaxar/utils';
import { ApplicationError, InvalidConfiguration, InvalidArgument } from '@galaxar/types';
import { defaultRoutableOpts } from './defaultOpts';

const Routable = (T) =>
    class extends T {
        /**
         * @param {string} name - The name of the routable instance.
         * @param {object} [options] - Routable options
         * @property {string} [options.backendPath='server'] - Relative path of back-end server source files
         * @property {string} [options.clientPath='client'] - Relative path of front-end client source files
         * @property {string} [options.publicPath='public'] - Relative path of front-end static files
         */
        constructor(name, options) {
            super(name, { ...defaultRoutableOpts, ...options });

            /**
             * Frontend static files path.
             * @member {string}
             **/
            this.publicPath = this.toAbsolutePath(this.options.publicPath);

            this.controllersPath = this.toAbsolutePath(this.options.controllersPath);

            this.routable = true;

            /**
             * Each app has its own router.
             * @member {Koa}
             **/
            this.router = this._createEngine();

            //inject the appModule instance in the first middleware
            this.router.use(
                this.router.middleware((ctx, next) => {
                    ctx.appModule = this;
                    return next();
                })
            );

            this.on('configLoaded', () => {
                //load middlewares if exists in server or app path
                if (fs.pathExistsSync(this.middlewaresPath) && isDir(this.middlewaresPath)) {
                    this.loadMiddlewaresFrom(this.middlewaresPath);
                }
            });
        }

        async start_() {
            /**
             * Middleware factory registry.
             * @member {object}
             */
            this.middlewareFactoryRegistry = {};

            return super.start_();
        }

        async stop_() {
            delete this.middlewareFactoryRegistry;

            return super.stop_();
        }

        /**
         * Load and regsiter middleware files from a specified path.
         * @param dir
         */
        loadMiddlewaresFrom(dir) {
            let files = globSync(path.join(dir, '**/*.{js,ts,mjs,cjs}'), { nodir: true });
            files.forEach((file) => this.registerMiddlewareFactory(text.baseName(file), require(file)));
        }

        /**
         * Register the factory method of a named middleware.
         * @param {string} name - The name of the middleware
         * @param {function} factoryMethod - The factory method of a middleware
         */
        registerMiddlewareFactory(name, factoryMethod) {
            if (typeof factoryMethod !== 'function') {
                if (factoryMethod.__esModule && typeof factoryMethod.default === 'function') {
                    factoryMethod = factoryMethod.default;
                } else {
                    throw new InvalidArgument('Invalid middleware factory: ' + name);
                }
            }

            if (name in this.middlewareFactoryRegistry) {
                throw new ApplicationError('Middleware "' + name + '" already registered!');
            }

            this.middlewareFactoryRegistry[name] = factoryMethod;
            this.log('verbose', `Registered named middleware [${name}].`);
        }

        /**
         * Get the factory method of a middleware from module hierarchy.
         * @param name
         * @returns {function}
         */
        getMiddlewareFactory(name) {
            const factory = this.middlewareFactoryRegistry[name];
            if (factory != null) {
                return factory;
            }

            if (this.server && !this.isServer) {
                return this.server.getMiddlewareFactory(name);
            }

            let npmMiddleware = this.tryRequire(name);
            if (npmMiddleware) {
                return npmMiddleware;
            }

            throw new ApplicationError(`Don't know where to load middleware "${name}".`);
        }

        /**
         * Use middlewares
         * @param {Router} router
         * @param {*} middlewares - Can be an array of middleware entries or a key-value list of registerred middlewares
         * @returns {Routable}
         */
        useMiddlewares(router, middlewares) {
            let middlewareFactory, middleware;
            let middlewareFunctions = [];

            if (_.isPlainObject(middlewares)) {
                _.forOwn(middlewares, (options, name) => {
                    middlewareFactory = this.getMiddlewareFactory(name);
                    middleware = middlewareFactory(options, this);
                    middlewareFunctions.push({ name, middleware });
                });
            } else {
                middlewares = _.castArray(middlewares);

                _.each(middlewares, (middlewareEntry) => {
                    let type = typeof middlewareEntry;

                    if (type === 'string') {
                        // [ 'namedMiddleware' ]
                        middlewareFactory = this.getMiddlewareFactory(middlewareEntry);
                        middleware = middlewareFactory(undefined, this);
                        middlewareFunctions.push({ name: middlewareEntry, middleware });
                    } else if (type === 'function') {
                        middlewareFunctions.push({
                            name: middlewareEntry.name || 'unamed middleware',
                            middleware: middlewareEntry,
                        });
                    } else if (Array.isArray(middlewareEntry)) {
                        // [ [ 'namedMiddleware', config ] ]
                        if (middlewareEntry.length === 0) {
                            throw new InvalidConfiguration(
                                'Empty array found as middleware entry!',
                                this,
                                'middlewares'
                            );
                        }

                        middlewareFactory = this.getMiddlewareFactory(middlewareEntry[0]);
                        middleware = middlewareFactory(middlewareEntry.length > 1 ? middlewareEntry[1] : null, this);
                        middlewareFunctions.push({ name: middlewareEntry[0], middleware });
                    } else {
                        if (!_.isPlainObject(middlewareEntry) || !('name' in middlewareEntry)) {
                            throw new InvalidConfiguration('Invalid middleware entry!', this, 'middlewares');
                        }

                        middlewareFactory = this.getMiddlewareFactory(middlewareEntry.name);
                        middleware = middlewareFactory(middlewareEntry.options, this);
                        middlewareFunctions.push({ name: middlewareEntry.name, middleware });
                    }
                });
            }

            middlewareFunctions.forEach(({ name, middleware }) => {
                if (Array.isArray(middleware)) {
                    middleware.forEach((m) => this.useMiddleware(router, m, name));
                } else {
                    this.useMiddleware(router, middleware, name);
                }
            });

            return this;
        }

        /**
         * Add a route to a router, skipped while the server running in deaf mode.
         * @param router
         * @param method
         * @param route
         * @param actions
         */
        addRoute(router, method, route, actions) {
            let handlers = [],
                middlewareFactory;

            if (_.isPlainObject(actions)) {
                _.each(actions, (options, name) => {
                    middlewareFactory = this.getMiddlewareFactory(name);
                    handlers.push(this._wrapMiddlewareTracer(middlewareFactory(options, this), name));
                });
            } else {
                actions = _.castArray(actions);
                let lastIndex = actions.length - 1;

                _.each(actions, (action, i) => {
                    let type = typeof action;

                    if (i === lastIndex) {
                        // last middleware may be an action
                        if (type === 'string' && action.lastIndexOf('.') > 0) {
                            action = {
                                name: 'action',
                                options: action,
                            };

                            type = 'object';
                        }
                    }

                    if (type === 'string') {
                        // [ 'namedMiddleware' ]
                        middlewareFactory = this.getMiddlewareFactory(action);

                        let middleware = middlewareFactory(null, this);

                        //in case it's register by the middlewareFactory feature
                        if (Array.isArray(middleware)) {
                            middleware.forEach((middlewareItem, i) =>
                                handlers.push(
                                    this._wrapMiddlewareTracer(
                                        middlewareItem,
                                        `${action}-${i}` + (middleware.name ? '-' + middleware.name : '')
                                    )
                                )
                            );
                        } else {
                            handlers.push(this._wrapMiddlewareTracer(middleware, action));
                        }
                    } else if (type === 'function') {
                        handlers.push(this._wrapMiddlewareTracer(action));
                    } else if (Array.isArray(action)) {
                        if (action.length === 0 || action.length > 2) {
                            throw new InvalidConfiguration('Invalid middleware entry!', this, 'middlewares');
                        } 

                        middlewareFactory = this.getMiddlewareFactory(action[0]);
                        handlers.push(
                            this._wrapMiddlewareTracer(
                                middlewareFactory(action.length > 1 ? action[1] : undefined, this)
                            )
                        );
                    } else {
                        if (typeof action !== 'object' || !('name' in action)) {
                            throw new InvalidConfiguration('Invalid middleware entry!', this, 'middlewares');
                        }

                        middlewareFactory = this.getMiddlewareFactory(action.name);
                        handlers.push(this._wrapMiddlewareTracer(middlewareFactory(action.options, this), action.name));
                    }
                });
            }

            router[method](route, ...handlers);

            let endpoint = router.opts.prefix
                ? urlUtil.join(this.route, router.opts.prefix, route)
                : urlUtil.join(this.route, route);

            this.log('verbose', `Route "${method}:${endpoint}" is added from module [${this.name}].`);

            return this;
        }

        requireFeatures(features, middleware) {
            let hasNotEnabled = _.find(_.castArray(features), feature => !this.enabled(feature));
        
            if (hasNotEnabled) {
                throw new InvalidConfiguration(
                    `Middleware "${middleware}" requires "${hasNotEnabled}" feature to be enabled.`,
                    this,
                    `middlewares.${middleware}`
                );
            }
        };

        /**
         * Attach a router to this app module, skipped while the server running in deaf mode
         * @param {Router} nestedRouter
         */
        addRouter(nestedRouter) {
            this.router.use(nestedRouter.routes());
            this.router.use(nestedRouter.allowedMethods());
            return this;
        }

        /**
         * Translate a relative path and query parameters if any to a url path
         * @param {string} relativePath - Relative path
         * @param {...*} [pathOrQuery] - Queries
         * @returns {string}
         */
        toWebPath(relativePath, ...pathOrQuery) {
            let url, query;

            if (pathOrQuery && pathOrQuery.length > 0 && (pathOrQuery.length > 1 || pathOrQuery[0] !== undefined)) {
                if (_.isObject(pathOrQuery[pathOrQuery.length - 1])) {
                    query = pathOrQuery.pop();
                }
                pathOrQuery.unshift(relativePath);
                url = urlUtil.join(this.route, ...pathOrQuery);
            } else {
                url = urlUtil.join(this.route, relativePath);
            }

            url = text.ensureStartsWith(url, '/');

            if (query) {
                url = urlUtil.appendQuery(url, query);
                url = url.replace('/?', '?');
            }

            return url;
        }

        useMiddleware(router, middleware, name) {
            if (typeof middleware !== 'function') {
                throw new InvalidArgument('Invalid middleware.', { name, middleware });
            }
            
            router.use(this._wrapMiddlewareTracer(middleware, name));
            this.log('verbose', `Attached middleware [${name}].`);
        }

        _wrapMiddlewareTracer(middleware, name) {
            if (this.options.traceMiddlewares) {
                return async (ctx, next) => {
                    this.log('debug', `Step in middleware "${name || middleware.name}" ...`);
                    let ret = await middleware(ctx, next);
                    this.log('debug', `Step out from middleware "${name || middleware.name}".`);
                    return ret;
                };
            }

            return middleware;
        }

        _createEngine() {
            try {
                let Engine = require(`./engines/${this.options.engine}`);
                if (Engine.__esModule && typeof Engine.default === 'function') {
                    // support es6 module
                    Engine = Engine.default;
                }
                return new Engine(this);
            } catch (err) {
                if (err.code === 'MODULE_NOT_FOUND') {
                    throw new InvalidArgument(`Engine "${this.options.engine}" is not supported.`);
                }

                throw err;
            }
        }

        _getFeatureFallbackPath() {
            let pathArray = super._getFeatureFallbackPath();            
            pathArray.splice(1, 0, path.resolve(__dirname, 'appFeatures'));
            
            return pathArray;
        }
    };

export default Routable;

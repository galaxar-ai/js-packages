import { _, sleep_, batchAsync_ } from '@galaxar/utils';
import { InvalidConfiguration } from '@galaxar/types';
import { defaultAppOpts } from './defaultOpts';

/**
 * Runnable app mixin.
 * @param {object} T - Base class.
 * @returns {Runnable} A runable app class.
 * @constructs Runnable(T)
 */
const Runnable = (T) =>
    class extends T {
        _getOnUncaughtException = (exitOnError) => (err) => {
            if (exitOnError) {
                //wait 1 second for flushing the last log
                this.log('error', err);
            } else {
                this.logError(err);
            }
        };

        _onWarning = (warning) => {
            this.log('warn', warning.message);
        };

        _onExit = (code) => {
            if (this.started) {
                this.stop_().catch(this.logError);
            }
        };

        /**
         * @param {string} name - The name of the application.
         * @param {object} [options] - Application options
         * @property {string} [options.logLevel='info'] - Logging level
         * @property {object} [options.ignoreUncaught=false] - Whether to skip the handling of uncaught exception
         * @property {object} [options.exitOnUncaught=true] - Whether to exit process on uncaught exception thrown
         * @constructs Runnable
         */
        constructor(name, options) {
            super(name, {
                ...defaultAppOpts,
                ...options,
            });

            this.runnable = true;

            this.libModulesPath = this.toAbsolutePath(this.options.libModulesPath);
        }

        /**
         * Start the app
         * @returns {Promise}
         * @memberof Runnable
         */
        async start_() {
            if (this.started) {
                throw new Error('App already started.');
            }

            this._initialize();

            process.on('exit', this._onExit);

            await super.start_();

            if (this.options.logLevel === 'verbose' || this.options.logLevel === 'debug') {
                const childModules = {};
                this.visitChildModules((childModule, name) => {
                    childModules[name] = {
                        features: Object.keys(childModule.features),
                        services: Object.keys(childModule.services),
                    };
                });

                this.log('verbose', 'Enabled features & services:', {
                    features: Object.keys(this.features),
                    services: Object.keys(this.services),
                    modules: childModules,
                });
            }

            return this;
        }

        /**
         * Stop the app
         * @returns {Promise}
         * @memberof Runnable
         */
        async stop_() {
            let stopByThis = false;

            if (this.started) {
                stopByThis = true;

                if (this.libModules) {
                    await batchAsync_(this.libModules, (lib) => lib.stop_());
                    delete this.libModules;
                }
            }

            process.removeListener('exit', this._onExit);

            await super.stop_();

            await sleep_(0);

            if (stopByThis) {
                this._uninitialize();
            }
        }

        visitChildModules(vistor) {
            if (this.libModules) {
                _.each(this.libModules, vistor);
            }
        }

        /**
         * Get the lib module
         * @param {string} libName
         * @memberof Runnable
         */
        getLib(libName) {
            if (!this.libModules) {
                throw new Error('"libModules" feature is required to access lib among modules.');
            }

            let libModule = this.libModules[libName];

            if (!libModule) {
                throw new Error(`Lib module [${libName}] not found.`);
            }

            return libModule;
        }

        /**
         * Require a module from the source path of a library module
         * @param {*} relativePath
         * @memberof Runnable
         */
        requireFromLib(libName, relativePath) {
            let libModule = this.getLib(libName);
            return libModule.require(relativePath);
        }

        /**
         * Register a loaded lib module
         * @param {LibModule} lib
         * @memberof Runnable
         */
        registerLib(lib) {
            if (!this.libModules) {
                this.libModules = {};
            }

            if (lib.name in this.libModules) {
                throw new InvalidConfiguration(`Lib module [${lib.name}] already exists.`, this, {
                    name: lib.name,
                });
            }

            this.libModules[lib.name] = lib;
        }

        /**
         * Get a registered service
         * @param {string} name
         *
         * @example
         *  // Get service from a lib module
         *  const service = app.getService('<lib name>/<service name>');
         *  // e.g const service = app.getService('data/mysql.mydb');
         * @memberof Runnable
         */
        getService(name) {
            let pos = name.indexOf('/');
            if (pos === -1) {
                return super.getService(name);
            }

            let lib = name.substring(0, pos);
            name = name.substring(pos + 1);

            let app = this.getLib(lib);
            return app?.getService(name, true);
        }

        _initialize() {
            this._pwd = process.cwd();
            if (this.workingPath !== this._pwd) {
                process.chdir(this.workingPath);
            }

            this._injectErrorHandlers();
        }

        _uninitialize() {
            const detach = true;
            this._injectErrorHandlers(detach);

            process.chdir(this._pwd);
            delete this._pwd;
        }

        _injectErrorHandlers(detach) {
            if (detach) {
                process.removeListener('warning', this._onWarning);
                if (this._onUncaughtException) {
                    process.removeListener('uncaughtException', this._onUncaughtException);
                    delete this._onUncaughtException;
                }

                return;
            }

            if (!this.options.ignoreUncaught) {
                this._onUncaughtException = this._getOnUncaughtException(this.options.exitOnUncaught);
                process.on('uncaughtException', this._onUncaughtException);
            }

            process.on('warning', this._onWarning);
        }
    };

export default Runnable;
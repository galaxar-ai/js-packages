import { _, sleep_, batchAsync_ } from '@galaxar/utils';
import { InvalidConfiguration } from '@galaxar/types';
import { defaultAppOpts } from './defaultOpts';
import { consoleLogger, makeLogger, setLogLevel } from './logger';

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
                let waitForLogging = setTimeout(() => {
                    process.exit(1);
                }, 1000);

                this.log('error', err, () => {
                    clearTimeout(waitForLogging);
                    process.exit(1);
                });
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
            this._initialize();

            process.on('exit', this._onExit);

            return super.start_();
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

        /**
         * Reset logger.
         * Use it only if the options.logger config is changed in runtime
         * @memberof Runnable
         */
        resetLogger() {
            this._injectLogger(true /** detach */);
            this._injectLogger();
        }

        _initialize() {
            this._pwd = process.cwd();
            if (this.workingPath !== this._pwd) {
                process.chdir(this.workingPath);
            }

            this._injectLogger();
            this._injectErrorHandlers();
        }

        _uninitialize() {
            const detach = true;
            this._injectErrorHandlers(detach);
            this._injectLogger(detach);

            process.chdir(this._pwd);
            delete this._pwd;
        }

        _injectLogger(detach) {
            if (detach) {
                this.log('verbose', 'Logger is detaching ...');

                if (this.logger?.close) {
                    this.logger.close();
                }

                delete this.logger;
                return;
            }

            if (this.options.logger) {
                this.logger = this.options.logger;
            } else {
                setLogLevel(this.options.logLevel);
                this.logger = { log: makeLogger(consoleLogger) };
            }

            this.log('verbose', 'Logger injected.');
        }

        _injectErrorHandlers(detach) {
            if (detach) {
                process.removeListener('warning', this._onWarning);
                if (this._onUncaughtException) {
                    process.removeListener('uncaughtException', this._onUncaughtException);
                    delete this._onUncaughtException;
                }
                this.log('verbose', 'Process-wide error handlers detached.');
                return;
            }

            if (!this.options.ignoreUncaught) {
                this._onUncaughtException = this._getOnUncaughtException(this.options.exitOnUncaught);
                process.on('uncaughtException', this._onUncaughtException);
            }

            process.on('warning', this._onWarning);
            this.log('verbose', 'Process-wide error handlers injected.');
        }
    };

export default Runnable;

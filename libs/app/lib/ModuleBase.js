import path from "node:path";

const ModuleBase = (Base) =>
    class extends Base {
        /**
         * @param {Runnable} hostApp
         * @param {string} name - The name of the app module.
         * @param {string} route - The base route of the app module.
         * @param {string} appPath - The path to load the app's module files
         * @param {object} [options] - The app module's extra options defined in its parent's configuration.
         * @property {bool} [options.logWithAppName=false] - Flag to include app name in log message.
         */
        constructor(hostApp, name, appPath, options) {
            super(
                name,                
                {
                    workingPath: appPath,
                    configPath: path.join(appPath, 'conf'),
                    sourcePath: './',
                    logWithAppName: true,
                    ...options
                }
            );

            /**
             * Hosting app.
             * @member {Runnable}
             **/
            this.host = hostApp;

            /**
             * Whether it is a server.
             * @member {boolean}
             **/
            this.isServer = false;

            /**
             * Source files path.
             * @member {string}
             **/
            this.sourcePath = this.toAbsolutePath(this.options.sourcePath);

            this.featuresPath = path.resolve(this.sourcePath, this.options.featuresPath);
        }

        /**
         * Get a service from module hierarchy
         * @param name
         * @returns {object}
         */
        getService(name, currentModuleOnly) {
            return super.getService(name) || (!currentModuleOnly && this.host.getService(name));
        }

        /**
         * Check whether a feature is enabled in the app or its hosting server.
         * @param {string} feature
         * @returns {bool}
         */
        enabled(feature, currentModuleOnly) {
            return super.enabled(feature) || (!currentModuleOnly && this.host.enabled(feature));
        }

        /**
         * Require a js module from backend path
         * @param {*} relativePath
         */
        require(relativePath) {
            let modPath = path.join(this.sourcePath, relativePath);
            return require(modPath);
        }

        /**
         * Require a module from the source path of a library module
         * @param {*} relativePath
         */
        requireFromLib(libName, relativePath) {
            return this.host.requireFromLib(libName, relativePath);
        }

        /**
         * Default log method, may be override by loggers feature
         * @param {string} level - Log level
         * @param {string} message - Log message
         * @param {...object} rest - Extra meta data
         * @returns {Routable}
         */
        log(level, ...rest) {
            if (this.options.logWithAppName) {
                rest = [ "[" + this.name + "]", ...rest ];
            }

            if (this.logger) {
                this.logger.log(level, ...rest);
            } else {
                this.host.log(level, ...rest);
            }

            return this;
        }
    };

export default ModuleBase;

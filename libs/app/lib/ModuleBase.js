import path from 'node:path';

const ModuleBase = (Base) =>
    class extends Base {
        /**
         * @param {Runnable} hostApp
         * @param {string} name - The name of the app module.
         * @param {string} route - The base route of the app module.
         * @param {string} appPath - The path to load the app's module files
         * @param {object} [options] - The app module's extra options defined in its parent's configuration.
         */
        constructor(hostApp, name, appPath, options) {
            super(name, {
                workingPath: appPath,
                configPath: path.join(appPath, 'conf'),
                sourcePath: './',
                ...options,
            });

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

            this.logger = this.host.logger?.child({ module: this.name }, { level: this.options.logLevel });
            this.log = (level, message, info) => {
                this.logger ? this.logger[level](info, message) : this.host.log(level, message, info);
                return this;
            };
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
    };

export default ModuleBase;
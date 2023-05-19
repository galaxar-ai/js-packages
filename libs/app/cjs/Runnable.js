'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _utils = require('@galaxar/utils');
const _types = require('@galaxar/types');
const _defaultOpts = require('./defaultOpts');
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}
const Runnable = (T) => {
    class _class extends T {
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
        async stop_() {
            let stopByThis = false;
            if (this.started) {
                stopByThis = true;
                if (this.libModules) {
                    await (0, _utils.batchAsync_)(this.libModules, (lib) => lib.stop_());
                    delete this.libModules;
                }
            }
            process.removeListener('exit', this._onExit);
            await super.stop_();
            await (0, _utils.sleep_)(0);
            if (stopByThis) {
                this._uninitialize();
            }
        }
        visitChildModules(vistor) {
            if (this.libModules) {
                _utils._.each(this.libModules, vistor);
            }
        }
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
        requireFromLib(libName, relativePath) {
            let libModule = this.getLib(libName);
            return libModule.require(relativePath);
        }
        registerLib(lib) {
            if (!this.libModules) {
                this.libModules = {};
            }
            if (lib.name in this.libModules) {
                throw new _types.InvalidConfiguration(`Lib module [${lib.name}] already exists.`, this, {
                    name: lib.name,
                });
            }
            this.libModules[lib.name] = lib;
        }
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
        constructor(name, options) {
            super(name, { ..._defaultOpts.defaultAppOpts, ...options });
            _define_property(this, '_getOnUncaughtException', (exitOnError) => (err) => {
                if (exitOnError) {
                    this.log('error', err);
                } else {
                    this.logError(err);
                }
            });
            _define_property(this, '_onWarning', (warning) => {
                this.log('warn', warning.message);
            });
            _define_property(this, '_onExit', (code) => {
                if (this.started) {
                    this.stop_().catch(this.logError);
                }
            });
            this.runnable = true;
            this.libModulesPath = this.toAbsolutePath(this.options.libModulesPath);
        }
    }
    return _class;
};
const _default = Runnable;
//# sourceMappingURL=Runnable.js.map

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _nodepath = _interop_require_default(require('node:path'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const ModuleBase = (Base) => {
    class _class extends Base {
        getService(name, currentModuleOnly) {
            return super.getService(name) || (!currentModuleOnly && this.host.getService(name));
        }
        enabled(feature, currentModuleOnly) {
            return super.enabled(feature) || (!currentModuleOnly && this.host.enabled(feature));
        }
        require(relativePath) {
            let modPath = _nodepath.default.join(this.sourcePath, relativePath);
            return require(modPath);
        }
        requireFromLib(libName, relativePath) {
            return this.host.requireFromLib(libName, relativePath);
        }
        constructor(hostApp, name, appPath, options) {
            super(name, {
                workingPath: appPath,
                configPath: _nodepath.default.join(appPath, 'conf'),
                sourcePath: './',
                ...options,
            });
            this.host = hostApp;
            this.isServer = false;
            this.sourcePath = this.toAbsolutePath(this.options.sourcePath);
            this.featuresPath = _nodepath.default.resolve(this.sourcePath, this.options.featuresPath);
            this.logger = this.host.logger?.child({ module: this.name }, { level: this.options.logLevel });
            this.log = (level, message, info) => {
                this.logger ? this.logger[level](info, message) : this.host.log(level, message, info);
                return this;
            };
        }
    }
    return _class;
};
const _default = ModuleBase;
//# sourceMappingURL=ModuleBase.js.map

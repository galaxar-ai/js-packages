'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _nodepath = _interop_require_default(require('node:path'));
const _sys = require('@galaxar/sys');
const _jsonc = require('@galaxar/jsonc');
const _Feature = _interop_require_default(require('../Feature'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const _default = {
    stage: _Feature.default.CONF,
    load_: async (app, options) => {
        let devName;
        try {
            devName = (await (0, _sys.run_)('git config --global user.email')).trim();
        } catch (e) {
            app.log('warn', e.message || e);
        }
        if (!devName || devName === '') {
            if (options.fallbackName) {
                devName = options.fallbackName;
            } else {
                app.log('warn', 'Unable to read "user.email" of git config and no fallback option is configured.');
                return;
            }
        }
        devName = devName.substring(0, devName.indexOf('@'));
        const devConfigFile = _nodepath.default.join(app.configPath, app.configName + '.' + devName + '.json');
        if (!_sys.fs.existsSync(devConfigFile)) {
            app.log('warn', `Developer specific config file "${devConfigFile}" does not exist and will use defaults.`);
            return;
        }
        app.configLoader.provider = new _jsonc.JsonConfigProvider(devConfigFile);
        return app.loadConfig_();
    },
};
//# sourceMappingURL=configByGitUser.js.map

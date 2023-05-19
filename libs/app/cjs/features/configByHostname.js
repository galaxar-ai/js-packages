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
        let hostName;
        try {
            hostName = (await (0, _sys.run_)('hostname')).trim();
        } catch (e) {
            app.log('warn', e.message || e);
        }
        if (!hostName) {
            throw new Error('Unable to read "hostname" from environment.');
        }
        let hostSpecConfigFile = _nodepath.default.join(app.configPath, app.configName + '.' + hostName + '.json');
        if (!_sys.fs.existsSync(hostSpecConfigFile)) {
            if (options.fallbackName) {
                hostName = options.fallbackName;
                let hostSpecConfigFileFb = _nodepath.default.join(
                    app.configPath,
                    app.configName + '.' + hostName + '.json'
                );
                if (!_sys.fs.existsSync(hostSpecConfigFileFb)) {
                    throw new Error(
                        `The specific config file for host [${hostName}] not found and the fallback config [${hostSpecConfigFileFb}] not found either.`
                    );
                }
                hostSpecConfigFile = hostSpecConfigFileFb;
            } else {
                app.log(
                    'warn',
                    `The specific config file for host [${hostName}] not found and no fallback setting. Use defaults.`
                );
                return;
            }
        }
        app.configLoader.provider = new _jsonc.JsonConfigProvider(hostSpecConfigFile);
        return app.loadConfig_();
    },
};
//# sourceMappingURL=configByHostname.js.map

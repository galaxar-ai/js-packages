'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _nodepath = _interop_require_default(require('node:path'));
const _jsonc = require('@galaxar/jsonc');
const _Feature = _interop_require_default(require('../Feature'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const _default = {
    stage: _Feature.default.CONF,
    load_: async (app, configPath) => {
        app.configLoader.provider = new _jsonc.JsonConfigProvider(_nodepath.default.resolve(configPath));
        return app.loadConfig_();
    },
};
//# sourceMappingURL=customConfig.js.map

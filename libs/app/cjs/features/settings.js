'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _types = require('@galaxar/types');
const _utils = require('@galaxar/utils');
const _Feature = _interop_require_default(require('../Feature'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const KEY_ENV = 'env:';
const KEY_STAGE = 'stage:';
const Stage = process.env.STAGE_ENV;
const _default = {
    stage: _Feature.default.INIT,
    load_: function (app, settings) {
        let result = {};
        let envSettings;
        let stageSettings;
        _utils._.each(settings, (value, key) => {
            if (key.startsWith(KEY_ENV)) {
                let envKey = key.substring(KEY_ENV.length);
                if (envKey === app.env) {
                    envSettings = value;
                    if (!(0, _utils.isPlainObject)(value)) {
                        throw new _types.InvalidConfiguration('Invalid env settings', app, `settings.${key}`);
                    }
                }
            } else if (Stage && key.startsWith(KEY_STAGE)) {
                let stageKey = key.substring(KEY_ENV.length);
                if (stageKey === Stage) {
                    stageSettings = value;
                    if (!(0, _utils.isPlainObject)(value)) {
                        throw new _types.InvalidConfiguration('Invalid stage settings', app, `settings.${key}`);
                    }
                }
            } else {
                result[key] = value;
            }
        });
        app.settings = Object.assign(result, envSettings, stageSettings);
    },
};
//# sourceMappingURL=settings.js.map

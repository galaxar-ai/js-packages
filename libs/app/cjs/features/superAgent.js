'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _Feature = _interop_require_default(require('../Feature'));
const _HttpClient = _interop_require_default(require('../helpers/HttpClient'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const _default = {
    stage: _Feature.default.SERVICE,
    groupable: true,
    load_: async function (app, settings, name) {
        const agent = app.tryRequire('superagent').agent();
        let client = new _HttpClient.default(agent, settings);
        app.registerService(name, client);
    },
};
//# sourceMappingURL=superAgent.js.map

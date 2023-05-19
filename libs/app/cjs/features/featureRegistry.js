'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _Feature = _interop_require_default(require('../Feature'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const _default = {
    stage: _Feature.default.CONF,
    load_: (app, registry) => {
        app.addFeatureRegistry(registry);
    },
};
//# sourceMappingURL=featureRegistry.js.map

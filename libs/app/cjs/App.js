'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _ServiceContainer = _interop_require_default(require('./ServiceContainer'));
const _Runnable = _interop_require_default(require('./Runnable'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
class App extends (0, _Runnable.default)(_ServiceContainer.default) {
    constructor(name, options) {
        super(name || 'app', options);
    }
}
const _default = App;
//# sourceMappingURL=App.js.map

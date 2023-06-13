"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _exitWithError = /*#__PURE__*/ _interop_require_default(require("../utils/exitWithError"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const tryDo_ = async (app, action)=>{
    try {
        await action();
    } catch (error) {
        (0, _exitWithError.default)(app, error.message || error);
    }
};
const _default = tryDo_;

//# sourceMappingURL=tryDo_.js.map
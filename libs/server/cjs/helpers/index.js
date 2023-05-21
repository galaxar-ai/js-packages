"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Controller: function() {
        return _Controller.default;
    },
    httpMethod: function() {
        return _httpMethod.default;
    },
    middleware: function() {
        return _middleware.default;
    },
    supportedMethods: function() {
        return _supportedMethods.default;
    }
});
const _Controller = /*#__PURE__*/ _interop_require_default(require("./Controller"));
const _httpMethod = /*#__PURE__*/ _interop_require_default(require("./httpMethod"));
const _middleware = /*#__PURE__*/ _interop_require_default(require("./middleware"));
const _supportedMethods = /*#__PURE__*/ _interop_require_default(require("./supportedMethods"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map
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
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _nodeos = /*#__PURE__*/ _interop_require_default(require("node:os"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getTempPath = (...relativePath)=>_nodepath.default.resolve(_nodeos.default.tmpdir(), "gx-create-app", ...relativePath);
const _default = getTempPath;

//# sourceMappingURL=getTempPath.js.map
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
const _sys = require("@galaxar/sys");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function ensureTargetPath(options) {
    const targetPath = _nodepath.default.join(options.workingPath, options.appDir);
    _sys.fs.ensureDirSync(targetPath);
    return targetPath;
}
;
const _default = ensureTargetPath;

//# sourceMappingURL=ensureTargetPath.js.map
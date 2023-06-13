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
const _utils = require("@galaxar/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const appNameToFileName = (appName)=>(0, _utils.replaceAll)((0, _utils.replaceAll)(appName, "@", ""), _nodepath.default.sep, "-");
const _default = appNameToFileName;

//# sourceMappingURL=appNameToFileName.js.map
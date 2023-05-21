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
const _nodeurl = /*#__PURE__*/ _interop_require_default(require("node:url"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function esmIsMain() {
    if (require("url").pathToFileURL(__filename).toString().startsWith('file:')) {
        // (A)
        const modulePath = _nodeurl.default.fileURLToPath(require("url").pathToFileURL(__filename).toString());
        if (process.argv[1] === modulePath) {
            // (B)
            return true;
        }
    }
    return false;
}
const _default = esmIsMain;

//# sourceMappingURL=esmIsMain.js.map
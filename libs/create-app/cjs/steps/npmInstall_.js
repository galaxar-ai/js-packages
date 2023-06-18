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
const _getPackageManager = /*#__PURE__*/ _interop_require_default(require("./getPackageManager"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function npmInstall_(app, targetPath, options) {
    if (!options.skipNpmInstall) {
        const manager = (0, _getPackageManager.default)(options);
        await manager.install_(app, targetPath);
    }
}
const _default = npmInstall_;

//# sourceMappingURL=npmInstall_.js.map
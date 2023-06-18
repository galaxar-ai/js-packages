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
const _getPackageManager = /*#__PURE__*/ _interop_require_default(require("../getPackageManager"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const addPackageManager = (config, templateMetadata, options)=>{
    const manager = (0, _getPackageManager.default)(options);
    const packageManagerVersion = manager.version();
    const packageManager = `${options.packageManager}@${packageManagerVersion}`;
    config.packageManager = packageManager;
};
const _default = addPackageManager;

//# sourceMappingURL=addPackageManager.js.map
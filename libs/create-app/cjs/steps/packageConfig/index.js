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
    addPackageManager: function() {
        return _addPackageManager.default;
    },
    addPackages: function() {
        return _addDependency.default;
    },
    fixNpmScripts: function() {
        return _fixNpmScripts.default;
    },
    setPublishMode: function() {
        return _setPublishMode.default;
    }
});
const _addPackageManager = /*#__PURE__*/ _interop_require_default(require("./addPackageManager"));
const _addDependency = /*#__PURE__*/ _interop_require_default(require("./addDependency"));
const _fixNpmScripts = /*#__PURE__*/ _interop_require_default(require("./fixNpmScripts"));
const _setPublishMode = /*#__PURE__*/ _interop_require_default(require("./setPublishMode"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map
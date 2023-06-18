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
    common_: function() {
        return _common_.default;
    },
    copyFiles_: function() {
        return _copyFiles_.default;
    },
    ensureSafeToCreateProject: function() {
        return _ensureSafeToCreateProject.default;
    },
    ensureTargetPath: function() {
        return _ensureTargetPath.default;
    },
    getPackageManager: function() {
        return _getPackageManager.default;
    },
    npmInstall_: function() {
        return _npmInstall_.default;
    },
    runCommand_: function() {
        return _runCommand_.default;
    },
    updateFile_: function() {
        return _updateFile_.default;
    },
    updatePackageJson_: function() {
        return _updatePackageJson_.default;
    }
});
const _common_ = /*#__PURE__*/ _interop_require_default(require("./common_"));
const _copyFiles_ = /*#__PURE__*/ _interop_require_default(require("./copyFiles_"));
const _ensureSafeToCreateProject = /*#__PURE__*/ _interop_require_default(require("./ensureSafeToCreateProject"));
const _ensureTargetPath = /*#__PURE__*/ _interop_require_default(require("./ensureTargetPath"));
const _getPackageManager = /*#__PURE__*/ _interop_require_default(require("./getPackageManager"));
const _npmInstall_ = /*#__PURE__*/ _interop_require_default(require("./npmInstall_"));
const _runCommand_ = /*#__PURE__*/ _interop_require_default(require("./runCommand_"));
const _updateFile_ = /*#__PURE__*/ _interop_require_default(require("./updateFile_"));
const _updatePackageJson_ = /*#__PURE__*/ _interop_require_default(require("./updatePackageJson_"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map
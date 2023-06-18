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
const _modes = require("./modes");
const _utils = require("./utils");
const _steps = /*#__PURE__*/ _interop_require_wildcard(require("./steps"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function downloadTemplate_(app, options) {
    let templateUrl;
    if (options.appMode === 'custom') {
        templateUrl = cmd.option("template");
    } else {
        templateUrl = _modes.modesDetail[options.appMode].url;
    }
    const tempDir = (0, _utils.getTempPath)('template', options.appMode);
    await _sys.fs.emptyDir(tempDir);
    const tarFile = _nodepath.default.join(tempDir, 'template.tgz');
    await (0, _utils.download_)(app, templateUrl, tarFile);
    app.log('verbose', `Saved to ${tarFile}`);
    return {
        tempDir,
        tarFile
    };
}
async function init_(app, options) {
    const { tempDir , tarFile  } = await downloadTemplate_(app, options);
    const tempPath = _nodepath.default.join(tempDir, 'extracted');
    await _sys.fs.emptyDir(tempPath);
    await (0, _utils.untar_)(tarFile, tempPath);
    const initFile = _nodepath.default.join(tempPath, '.galaxar.init.js');
    const templateMetadata = require(initFile);
    const targetPath = _steps.ensureTargetPath(options);
    if (templateMetadata.newProject) {
        _steps.ensureSafeToCreateProject(app, targetPath, [
            "package.json"
        ]);
    }
    await _steps.copyFiles_(app, tempPath, targetPath, !templateMetadata.newProject && templateMetadata.noOverriding);
    if (templateMetadata.newProject) {
        // For new project, update the name in package.json
        await _steps.updatePackageJson_(app, targetPath, templateMetadata, options, [
            (packageConfig, $_, options)=>{
                packageConfig.name = options.appName;
            }
        ]);
    }
    // update npmrc, remove unused files
    await _steps.common_(app, targetPath, templateMetadata, options);
    await _steps.npmInstall_(app, targetPath, options);
}
;
const _default = init_;

//# sourceMappingURL=init_.js.map
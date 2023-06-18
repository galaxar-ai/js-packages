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
const _utils = require("@galaxar/utils");
const _glob = require("glob");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function copyFiles_(app, templatePath, targetPath, skipOverriding) {
    const files = await (0, _glob.glob)("**/*.*", {
        cwd: templatePath,
        dot: true
    });
    await (0, _utils.batchAsync_)(files, async (relativePath)=>{
        let sourceFile = _nodepath.default.join(templatePath, relativePath);
        let destFile = _nodepath.default.join(targetPath, relativePath);
        const ls = await _sys.fs.lstat(sourceFile);
        if (ls.isDirectory()) {
            await _sys.fs.ensureDir(destFile);
            return;
        }
        if (skipOverriding && _sys.fs.existsSync(destFile)) {
            app.log('info', `Skipped existing ${relativePath}`);
            return;
        }
        await _sys.fs.ensureFile(destFile);
        await _sys.fs.copyFile(sourceFile, destFile);
        app.log('info', `Copied ${relativePath}`);
    });
}
;
const _default = copyFiles_;

//# sourceMappingURL=copyFiles_.js.map
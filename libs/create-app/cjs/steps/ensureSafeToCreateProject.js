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
function ensureSafeToCreateProject(app, targetPath, arrayConflitFiles) {
    const conflicts = [];
    arrayConflitFiles.forEach((file)=>{
        const filePath = _nodepath.default.join(targetPath, file);
        if (_sys.fs.existsSync(filePath)) {
            conflicts.push(file);
        }
    });
    if (conflicts.length > 0) {
        throw new Error(`The target path [${targetPath}] contains files that could conflict:\n  - ` + conflicts.join('\n  - '));
    }
    app.log("verbose", "The target path is safe to create project.");
}
const _default = ensureSafeToCreateProject;

//# sourceMappingURL=ensureSafeToCreateProject.js.map
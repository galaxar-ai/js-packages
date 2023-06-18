"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _sys = require("@galaxar/sys");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
module.exports = async (app, rootPath, initMeta, options, updaters)=>{
    const packageConfigFileName = 'package.json';
    const packageConfigFile = _nodepath.default.join(rootPath, packageConfigFileName);
    const packageConfig = await _sys.fs.readJson(packageConfigFile);
    updaters.forEach((update)=>update(packageConfig, initMeta, options));
    await _sys.fs.writeJson(packageConfigFile, packageConfig, {
        spaces: 4
    });
    app.log('info', `Updated ${packageConfigFileName}`);
};

//# sourceMappingURL=updatePackageJson_.js.map
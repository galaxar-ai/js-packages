"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _utils = require("@galaxar/utils");
const _sys = require("@galaxar/sys");
const _updateFile_ = /*#__PURE__*/ _interop_require_default(require("./updateFile_"));
const _packageManager = /*#__PURE__*/ _interop_require_wildcard(require("./packageManager"));
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
module.exports = async (app, targetPath, initMeta, options)=>{
    const npmrcPath = _nodepath.default.join(targetPath, '.npmrc');
    const npmrcExists = await _sys.fs.exists(npmrcPath);
    const needUpdateNpmrc = options.registry !== 'npmjs' || npmrcExists;
    if (needUpdateNpmrc) {
        await (0, _updateFile_.default)(app, targetPath, '.npmrc', (vars)=>{
            const { registry , ...otherVars } = vars;
            if (options.registry !== 'npmjs') {
                let _registry = options.registry;
                return {
                    ...otherVars,
                    registry: _registry
                };
            }
            return otherVars;
        });
    }
    // remove files of other package manager
    const pm = options.packageManager;
    const allOtherPms = Object.keys(_utils._.omit(_packageManager, [
        pm
    ]));
    await (0, _utils.eachAsync_)(allOtherPms, async (_pm)=>{
        const files = initMeta[_pm]?.files;
        if (files) {
            await (0, _utils.eachAsync_)(files, async (file)=>{
                await _sys.fs.remove(_nodepath.default.join(targetPath, file));
            });
        }
    });
    // remove init meta file
    await _sys.fs.remove(_nodepath.default.join(targetPath, '.galaxar.init.js'));
};

//# sourceMappingURL=common_.js.map
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
const _superagent = /*#__PURE__*/ _interop_require_default(require("superagent"));
const _sys = require("@galaxar/sys");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const download_ = async (app, url, saveToPath)=>{
    const dirName = _nodepath.default.dirname(saveToPath);
    await _sys.fs.ensureDir(dirName);
    const stream = _sys.fs.createWriteStream(saveToPath);
    return new Promise((resolve, reject)=>{
        stream.on('close', ()=>{
            resolve();
            app.log('info', `Downloaded ${url}`);
        });
        stream.on('error', (err)=>{
            reject(err);
        });
        _superagent.default.get(url).pipe(stream);
    });
};
const _default = download_;

//# sourceMappingURL=download_.js.map
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
const _superagent = /*#__PURE__*/ _interop_require_default(require("superagent"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const download_ = async (app, url, saveToPath)=>{
    const dirName = path.dirname(saveToPath);
    await fs.ensureDir(dirName);
    const stream = fs.createWriteStream(saveToPath);
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
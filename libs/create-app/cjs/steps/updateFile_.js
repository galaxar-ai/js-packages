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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const fileTypeMapper = {
    ".npmrc": "export"
};
function parseExports(content) {
    const lines = content.split("\n");
    return lines.reduce((vars, line)=>{
        if (line === "") return vars;
        let [key, value] = line.split("=");
        value = value.trim();
        vars[key.trim()] = (0, _utils.unquote)(value, true, [
            '"',
            "'"
        ]);
        return vars;
    }, {});
}
function formatExports(vars) {
    const lines = [];
    _utils._.each(vars, (v, k)=>{
        lines.push(`${k} = ${typeof v === "string" ? (0, _utils.quote)(v) : v}`);
    });
    return lines.join("\n") + "\n";
}
async function updateFile_(app, targetPath, relativePath, updater) {
    const filePath = _nodepath.default.resolve(targetPath, relativePath);
    const baseName = _nodepath.default.basename(relativePath);
    const fileExists = await _sys.fs.exists(filePath);
    const content = fileExists ? await _sys.fs.readFile(filePath, "utf8") : "";
    const fileType = fileTypeMapper[baseName];
    let updated;
    let noContent = false;
    switch(fileType){
        case "export":
            updated = await updater(parseExports(content));
            noContent = _utils._.isEmpty(updated);
            updated = formatExports(updated);
            break;
        case "json":
            updated = await updater(JSON.parse(content));
            noContent = _utils._.isEmpty(updated);
            updated = JSON.stringify(updated);
            break;
    }
    if (!fileExists && noContent) {
        return;
    }
    await _sys.fs.writeFile(filePath, updated, "utf8");
    app.log("info", `Updated file ${relativePath}`);
}
;
const _default = updateFile_;

//# sourceMappingURL=updateFile_.js.map
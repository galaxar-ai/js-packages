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
const _utils = require("@galaxar/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const deleteLines_ = async (sourceFile, lines)=>{
    let content = await fs.readFile(sourceFile, 'utf8');
    content = (0, _utils.deleteLines)(content, lines, _nodepath.default.sep);
    await fs.outputFile(sourceFile, content);
};
const _default = deleteLines_;

//# sourceMappingURL=deleteLines_.js.map
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
const _tar = /*#__PURE__*/ _interop_require_default(require("tar"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const untar_ = async (file, outputDir)=>{
    return _tar.default.x(// or tar.extract(
    {
        file,
        strip: 1,
        cwd: outputDir
    });
};
const _default = untar_;

//# sourceMappingURL=untar_.js.map
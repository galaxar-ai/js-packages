"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    npm: function() {
        return _npm.default;
    },
    pnpm: function() {
        return _pnpm.default;
    },
    yarn: function() {
        return _yarn.default;
    }
});
const _npm = /*#__PURE__*/ _interop_require_default(require("./npm"));
const _pnpm = /*#__PURE__*/ _interop_require_default(require("./pnpm"));
const _yarn = /*#__PURE__*/ _interop_require_default(require("./yarn"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _index.default;
    }
});
const _config = /*#__PURE__*/ _interop_require_default(require("./config"));
const _enUS = /*#__PURE__*/ _interop_require_default(require("./locale/en-US"));
const _zhCN = /*#__PURE__*/ _interop_require_default(require("./locale/zh-CN"));
const _zhTW = /*#__PURE__*/ _interop_require_default(require("./locale/zh-TW"));
const _index = /*#__PURE__*/ _interop_require_default(_export_star(require("./index"), exports));
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_config.default.loadMessages('en-US', _enUS.default).loadMessages('zh-CN', _zhCN.default).loadMessages('zh-TW', _zhTW.default).setLocale('en-US');

//# sourceMappingURL=bundle.js.map
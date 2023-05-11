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
var _replaceAll = /*#__PURE__*/ _interop_require_default(require("./replaceAll"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Quote a string.
 * @function string.quote
 * @param {String} str
 * @param {String} [quoteChar=']
 * @returns {String}
 */ function quote(str) {
    var quoteChar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '"';
    return quoteChar + (0, _replaceAll.default)(str, quoteChar, "\\" + quoteChar) + quoteChar;
}
var _default = quote;

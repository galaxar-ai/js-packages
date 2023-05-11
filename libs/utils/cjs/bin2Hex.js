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
var _range = /*#__PURE__*/ _interop_require_default(require("lodash/range"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Bin to hex, like 0x7F
 * @function string.bin2Hex
 * @param {Buffer} bin
 * @returns {String}
 */ function bin2Hex(bin) {
    bin = bin.toString();
    return "0x" + (0, _range.default)(bin.length).map(function(i) {
        return bin.charCodeAt(i).toString(16);
    }).join("");
}
var _default = bin2Hex;

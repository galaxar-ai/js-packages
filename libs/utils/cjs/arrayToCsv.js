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
var _quote = /*#__PURE__*/ _interop_require_default(require("./quote"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var arrayToCsv = function(data) {
    var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ",";
    if (data == null) {
        return "";
    }
    if (!Array.isArray(data)) {
        throw new Error("The target argument should be an array.");
    }
    return data.map(function(elem) {
        elem = elem.toString();
        return elem.indexOf(separator) !== -1 ? (0, _quote.default)(elem, '"') : elem;
    }).join(separator);
};
var _default = arrayToCsv;

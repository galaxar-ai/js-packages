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
var _reduce = /*#__PURE__*/ _interop_require_default(require("lodash/reduce"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var filterNull = function(obj) {
    return (0, _reduce.default)(obj, function(result, v, k) {
        if (v != null) {
            result[k] = v;
        }
        return result;
    }, {});
};
var _default = filterNull;

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
var _each = /*#__PURE__*/ _interop_require_default(require("lodash/each"));
var _isPlainObject = /*#__PURE__*/ _interop_require_default(require("./isPlainObject"));
var _set = /*#__PURE__*/ _interop_require_default(require("./set"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var unflattenObject = function(object) {
    var keyPathSep = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ".";
    if (!(0, _isPlainObject.default)(object)) {
        throw new Error("The argument is not an object.");
    }
    var options = {
        numberAsArrayIndex: true,
        keyPathSeparator: keyPathSep
    };
    var result = {};
    (0, _each.default)(object, function(v, k) {
        (0, _set.default)(result, k, v, options);
    });
    return result;
};
var _default = unflattenObject;

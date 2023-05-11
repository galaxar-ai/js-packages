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
var _dropIfEndsWith = /*#__PURE__*/ _interop_require_default(require("./dropIfEndsWith"));
var _ensureStartsWith = /*#__PURE__*/ _interop_require_default(require("./ensureStartsWith"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Join base url and the extra url path.
 * @function string.urlJoin
 * @param {String} base
 * @param {String} extraPath
 * @param {...any} more - More path
 * @returns {String}
 */ function join(base, extraPath) {
    for(var _len = arguments.length, more = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        more[_key - 2] = arguments[_key];
    }
    if (more && more.length > 0) {
        return more.reduce(function(result, part) {
            return join(result, part);
        }, join(base, extraPath));
    }
    return base ? extraPath ? (0, _dropIfEndsWith.default)(base, "/") + (0, _ensureStartsWith.default)(extraPath, "/") : base : extraPath;
}
var _default = join;

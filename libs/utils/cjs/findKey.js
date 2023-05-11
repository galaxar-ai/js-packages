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
var _isPlainObject = /*#__PURE__*/ _interop_require_default(require("./isPlainObject"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Iterate a collection until predicate returns true
 * The returned value is undefined if not found.
 * That's different from the _.find() function in lodash.
 * @alias collection.findKey
 * @param {Array|Object} obj
 * @param {iterator} predicate
 * @returns {Promise.<Object|undefined>}
 */ function findKey(obj, predicate) {
    if (Array.isArray(obj)) {
        var l = obj.length;
        for(var i = 0; i < l; i++){
            var el = obj[i];
            if (predicate(el, i, obj)) {
                return i;
            }
        }
        return undefined;
    } else if ((0, _isPlainObject.default)(obj)) {
        for(var k in obj){
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                var el1 = obj[k];
                if (predicate(el1, k, obj)) {
                    return k;
                }
            }
        }
        return undefined;
    }
    throw new Error("The first argument should be a collection.");
}
var _default = findKey;

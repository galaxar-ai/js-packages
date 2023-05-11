/**
 * Insert a separator as element into an array.
 * @alias array.insertBetween
 * @param {Array} arr
 * @param {*} separator
 * @returns {Array} The newly inserted array
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var insertSep = function(lastIndex, separator) {
    return function(e, i) {
        return i < lastIndex ? [
            e,
            separator
        ] : [
            e
        ];
    };
};
var insertSepFunctor = function(lastIndex, separator) {
    return function(e, i) {
        return i < lastIndex ? [
            e,
            separator(i)
        ] : [
            e
        ];
    };
};
var insertBetween = function(arr, separator) {
    return (typeof separator === "function" ? arr.map(insertSepFunctor(arr.length - 1, separator)) : arr.map(insertSep(arr.length - 1, separator))).reduce(function(a, b) {
        return _to_consumable_array(a).concat([
            b
        ]);
    }, []);
};
var _default = insertBetween;

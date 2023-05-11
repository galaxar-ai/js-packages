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
var _get = /*#__PURE__*/ _interop_require_default(require("./get"));
var _set = /*#__PURE__*/ _interop_require_default(require("./set"));
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
/**
 * Push an value into an array element of a collection
 * @alias object.pushIntoBucket
 * @param {Object} collection
 * @param {string} key
 * @param {Object} value
 * @param {boolean} [flattenArray=false] - Whether to flatten the array, if the given value is an array.
 * @returns {*} The modified bucket
 */ function pushIntoBucket(collection, key, value, flattenArray) {
    var bucket = (0, _get.default)(collection, key);
    if (Array.isArray(bucket)) {
        if (Array.isArray(value) && flattenArray) {
            bucket = bucket.concat(value);
            (0, _set.default)(collection, key, bucket);
        } else {
            bucket.push(value);
        }
    } else if (bucket == null) {
        bucket = Array.isArray(value) && flattenArray ? value.concat() : [
            value
        ];
        (0, _set.default)(collection, key, bucket);
    } else {
        bucket = Array.isArray(value) && flattenArray ? [
            bucket
        ].concat(_to_consumable_array(value)) : [
            bucket,
            value
        ];
        (0, _set.default)(collection, key, bucket);
    }
    return bucket;
}
var _default = pushIntoBucket;

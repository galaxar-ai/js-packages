"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    insertBetween: function() {
        return _insertBetween.default;
    },
    zipAndFlat: function() {
        return _zipAndFlat.default;
    },
    arrayToObject: function() {
        return _arrayToObject.default;
    },
    arrayToCsv: function() {
        return _arrayToCsv.default;
    },
    move: function() {
        return move;
    },
    swap: function() {
        return swap;
    },
    insert: function() {
        return insert;
    },
    copyArrayLike: function() {
        return copyArrayLike;
    },
    uniqPush: function() {
        return uniqPush;
    }
});
var _insertBetween = /*#__PURE__*/ _interop_require_default(require("./insertBetween"));
var _zipAndFlat = /*#__PURE__*/ _interop_require_default(require("./zipAndFlat"));
var _arrayToObject = /*#__PURE__*/ _interop_require_default(require("./arrayToObject"));
var _arrayToCsv = /*#__PURE__*/ _interop_require_default(require("./arrayToCsv"));
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
var move = function(array, from, to) {
    var copy = copyArrayLike(array);
    var value = copy[from];
    copy.splice(from, 1);
    copy.splice(to, 0, value);
    return copy;
};
var swap = function(arrayLike, indexA, indexB) {
    var copy = copyArrayLike(arrayLike);
    var a = copy[indexA];
    copy[indexA] = copy[indexB];
    copy[indexB] = a;
    return copy;
};
var insert = function(arrayLike, index, value) {
    var copy = copyArrayLike(arrayLike);
    copy.splice(index, 0, value);
    return copy;
};
var copyArrayLike = function(arrayLike) {
    if (!arrayLike) {
        return [];
    } else {
        return _to_consumable_array(arrayLike);
    }
};
var uniqPush = function(arrayLike, value) {
    if (!arrayLike.includes(value)) {
        return _to_consumable_array(arrayLike).concat([
            value
        ]);
    }
    return arrayLike;
};

/**
 * Convert an array into a k-v paired object.
 * @alias array.arrayToObject
 * @param {*} arrayOfObjects
 * @param {*} keyGetter
 * @param {*} valueGetter
 * @returns {Object}
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
var arrayToObject = function(arrayOfObjects, keyGetter, valueGetter) {
    if (arrayOfObjects == null) {
        return null;
    }
    if (!Array.isArray(arrayOfObjects)) {
        throw new Error("The target argument should be an array.");
    }
    var _keyGetter = typeof keyGetter === "function" ? keyGetter : function(obj) {
        return obj[keyGetter];
    };
    var _valueGetter = valueGetter == null ? function(obj) {
        return obj;
    } : typeof valueGetter === "function" ? valueGetter : function(obj) {
        return obj[valueGetter];
    };
    return arrayOfObjects.reduce(function(table, obj, index) {
        table[_keyGetter(obj, index)] = _valueGetter(obj, index);
        return table;
    }, {});
};
var _default = arrayToObject;

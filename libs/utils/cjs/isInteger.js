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
    RANGE_POSITIVE: function() {
        return RANGE_POSITIVE;
    },
    RANGE_NEGATIVE: function() {
        return RANGE_NEGATIVE;
    },
    RANGE_INDEX: function() {
        return RANGE_INDEX;
    },
    RANGE_NON_ZERO: function() {
        return RANGE_NON_ZERO;
    },
    default: function() {
        return _default;
    }
});
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var regexInt = /^(\+|-)?\d+$/;
var regexPos = /^\+?[1-9]\d*$/;
var regexIndex = /^0$|^([1-9]\d*)$/;
var regexNeg = /^-[1-9]\d*$/;
var regexNonZero = /^(\+|-)?[1-9]\d*$/;
var RANGE_POSITIVE = "positive";
var RANGE_NEGATIVE = "negative";
var RANGE_INDEX = "index";
var RANGE_NON_ZERO = "nonZero";
var _obj;
var mapRegex = (_obj = {}, _define_property(_obj, RANGE_POSITIVE, regexPos), _define_property(_obj, RANGE_INDEX, regexIndex), _define_property(_obj, RANGE_NEGATIVE, regexNeg), _define_property(_obj, RANGE_NON_ZERO, regexNonZero), _obj);
/**
 * Check a number or string whether it is exactly an integer
 * @param {*} value
 * @returns {boolean}
 */ var isInteger = function(value, options) {
    options = _object_spread({
        range: "all"
    }, options);
    var type = typeof value === "undefined" ? "undefined" : _type_of(value);
    if (type === "number") {
        return Number.isInteger(value);
    } else if (type === "string") {
        value = value.trim();
        var regex = mapRegex[options.range] || regexInt;
        if (regex.test(value)) {
            return true;
        }
    }
    return false;
};
var _default = isInteger;

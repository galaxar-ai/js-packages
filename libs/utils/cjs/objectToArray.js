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
var _map = /*#__PURE__*/ _interop_require_default(require("lodash/map"));
var _get = /*#__PURE__*/ _interop_require_default(require("./get"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Convert a k-v paired object into an array pair-by-pair.
 * @alias object.objectToArray
 * @param {*} object
 * @param {*} keyNaming
 * @param {*} valueNaming
 * @returns {array}
 */ var objectToArray = function(object, keyNaming, valueNaming, valuePath) {
    // (object, elementBuilder)
    if (typeof keyNaming === "function") {
        if (valueNaming != null || valuePath != null) {
            throw new Error("Invalid argument!");
        }
        return (0, _map.default)(object, keyNaming /* elementBuilder(v, k) => array element */ );
    }
    keyNaming !== null && keyNaming !== void 0 ? keyNaming : keyNaming = "name";
    valueNaming !== null && valueNaming !== void 0 ? valueNaming : valueNaming = "value";
    return (0, _map.default)(object, function(v, k) {
        var _obj;
        return _obj = {}, _define_property(_obj, keyNaming, k), _define_property(_obj, valueNaming, valuePath ? (0, _get.default)(v, valuePath) : v), _obj;
    });
};
var _default = objectToArray;

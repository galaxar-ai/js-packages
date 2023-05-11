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
/**
 * Remap the keys of object elements in an array, like projection.
 * @alias object.remap
 * @param {*} object
 * @param {Object} mapping - key to newKey or key to array[ newKey, valueMap ] for next level mapping
 * @param {boolean} keepUnmapped - If true, will keep those not in mapping as its original key, otherwise filter out
 * @returns {Object} Remapped object
 */ function remap(object, mapping, keepUnmapped) {
    if (typeof mapping === "string") return _define_property({}, mapping, object);
    var newObj = {};
    (0, _each.default)(object, function(v, k) {
        /* eslint-disable no-prototype-builtins */ if (mapping.hasOwnProperty(k)) {
            /* eslint-enable no-prototype-builtins */ var nk = mapping[k];
            if (Array.isArray(nk)) {
                newObj[nk[0]] = _object_spread({}, newObj[nk[0]], remap(v, nk[1], keepUnmapped));
            } else {
                newObj[nk] = v;
            }
        } else {
            if (keepUnmapped) {
                newObj[k] = v;
            }
        }
    });
    return newObj;
}
var _default = remap;

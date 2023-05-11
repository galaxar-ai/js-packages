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
var _clone = /*#__PURE__*/ _interop_require_default(require("lodash/clone"));
var _isInteger = /*#__PURE__*/ _interop_require_wildcard(require("./isInteger"));
var _set = require("./set");
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
// copy on write set
function cowSet(collection, keyPath, value, options) {
    options = _object_spread({
        numberAsArrayIndex: true,
        keyPathSeparator: "."
    }, options);
    if (collection == null || typeof collection !== "object") {
        return collection;
    }
    if (keyPath == null) {
        return collection;
    }
    var nodes = Array.isArray(keyPath) ? keyPath.concat() : keyPath.split(options.keyPathSeparator);
    var length = nodes.length;
    if (length > 0) {
        var lastIndex = length - 1;
        var index = 0;
        var nested = (0, _clone.default)(collection);
        collection = nested;
        while(nested != null && index < lastIndex){
            var key = nodes[index++];
            var next = nested[key];
            if (next == null || typeof next !== "object") {
                // peek next node, see if it is integer
                var nextKey = nodes[index];
                if (options.numberAsArrayIndex && (0, _isInteger.default)(nextKey, {
                    range: _isInteger.RANGE_INDEX
                })) {
                    next = (0, _set.addEntry)(nested, key, [], options.numberAsArrayIndex);
                } else {
                    next = (0, _set.addEntry)(nested, key, {}, options.numberAsArrayIndex);
                }
                nested = next;
            } else {
                nested[key] = (0, _clone.default)(next);
                nested = nested[key];
            }
        }
        var lastKey = nodes[lastIndex];
        (0, _set.addEntry)(nested, lastKey, value, options.numberAsArrayIndex);
    }
    return collection;
}
var _default = cowSet;

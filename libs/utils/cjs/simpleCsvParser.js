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
var _replaceAll = /*#__PURE__*/ _interop_require_default(require("./replaceAll"));
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
 * Parse csv string into array, simple implementation especially for one-line parsing.
 * 23x faster than csv-parse for single line parsing
 * 10x faster than csv-parse/sync for single line parsing
 *
 * split + simpleCsvParser, however split('\n') is not good for massive data, should use stream reader instead
 * 5x faster than csv-parse/sync for multiple lines parsing
 *
 * @param {string} str
 * @param {object} [options]
 * @property {string} [options.delimiter=',']
 * @property {boolean} [options.emptyAsNull=false]
 * @returns {array}
 */ var simpleCsvParser = function(str, options) {
    var _$_object_spread = _object_spread({
        delimiter: ",",
        emptyAsNull: false
    }, options), delimiter = _$_object_spread.delimiter, emptyAsNull = _$_object_spread.emptyAsNull;
    var inQuote = null;
    var start = 0;
    var result = [];
    var lastWord = null;
    var hasEscaped = false;
    var l = str.length;
    for(var i = 0; i < l; i++){
        var ch = str[i];
        if (inQuote) {
            if (ch === inQuote) {
                if (str[i - 1] === "\\") {
                    hasEscaped = true;
                } else {
                    // not escaped
                    lastWord = str.substring(start, i);
                    if (lastWord && hasEscaped) {
                        lastWord = (0, _replaceAll.default)(lastWord, "\\" + inQuote, inQuote);
                    }
                    inQuote = null;
                    hasEscaped = false;
                }
            }
        } else if (ch === delimiter) {
            if (lastWord == null && i > start) {
                lastWord = str.substring(start, i);
            }
            result.push(lastWord ? lastWord.trim() : emptyAsNull ? null : "");
            lastWord = null;
            hasEscaped = false;
            start = i + 1;
        } else if (ch === '"' || ch === "'") {
            if (lastWord == null) {
                inQuote = ch;
                start = i + 1;
            }
        }
    }
    if (lastWord == null) {
        lastWord = str.substring(start);
    }
    result.push(lastWord ? lastWord.trim() : emptyAsNull ? null : "");
    return result;
};
var _default = simpleCsvParser;

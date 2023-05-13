/**
 * @module text
 */ "use strict";
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
    quote: function() {
        return _quote.default;
    },
    unquote: function() {
        return _unquote.default;
    },
    isQuoted: function() {
        return _isQuoted.default;
    },
    isWrappedWith: function() {
        return _isWrappedWith.default;
    },
    bin2Hex: function() {
        return _bin2Hex.default;
    },
    base64Encode: function() {
        return _base64Encode.default;
    },
    base64Decode: function() {
        return _base64Decode.default;
    },
    compile: function() {
        return _compile.default;
    },
    template: function() {
        return _template.default;
    },
    replaceAll: function() {
        return _replaceAll.default;
    },
    dropIfEndsWith: function() {
        return _dropIfEndsWith.default;
    },
    dropIfStartsWith: function() {
        return _dropIfStartsWith.default;
    },
    ensureEndsWith: function() {
        return _ensureEndsWith.default;
    },
    ensureStartsWith: function() {
        return _ensureStartsWith.default;
    },
    csvLineParse: function() {
        return _csvLineParse.default;
    }
});
const _quote = /*#__PURE__*/ _interop_require_default(require("./quote"));
const _unquote = /*#__PURE__*/ _interop_require_default(require("./unquote"));
const _isQuoted = /*#__PURE__*/ _interop_require_default(require("./isQuoted"));
const _isWrappedWith = /*#__PURE__*/ _interop_require_default(require("./isWrappedWith"));
const _bin2Hex = /*#__PURE__*/ _interop_require_default(require("./bin2Hex"));
const _base64Encode = /*#__PURE__*/ _interop_require_default(require("./base64Encode"));
const _base64Decode = /*#__PURE__*/ _interop_require_default(require("./base64Decode"));
const _compile = /*#__PURE__*/ _interop_require_default(require("./compile"));
const _template = /*#__PURE__*/ _interop_require_default(require("./template"));
const _replaceAll = /*#__PURE__*/ _interop_require_default(require("./replaceAll"));
const _dropIfEndsWith = /*#__PURE__*/ _interop_require_default(require("./dropIfEndsWith"));
const _dropIfStartsWith = /*#__PURE__*/ _interop_require_default(require("./dropIfStartsWith"));
const _ensureEndsWith = /*#__PURE__*/ _interop_require_default(require("./ensureEndsWith"));
const _ensureStartsWith = /*#__PURE__*/ _interop_require_default(require("./ensureStartsWith"));
const _csvLineParse = /*#__PURE__*/ _interop_require_default(require("./csvLineParse"));
_export_star(require("./trim"), exports);
_export_star(require("./padding"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=text.js.map
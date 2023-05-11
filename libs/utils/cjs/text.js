/**
 * @module text
 * @borrows string.quote as quote
 * @borrows string.unquote as unquote
 * @borrows string.isQuoted as isQuoted
 * @borrows string.isWrappedWith as isWrappedWith
 * @borrows string.bin2Hex as bin2Hex
 * @borrows string.compile as compile
 * @borrows string.template as template
 * @borrows string.replaceAll as replaceAll
 * @borrows string.dropIfEndsWith as dropIfEndsWith
 * @borrows string.dropIfStartsWith as dropIfStartsWith
 * @borrows string.ensureEndsWith as ensureEndsWith
 * @borrows string.ensureStartsWith as ensureStartsWith
 * @borrows string.simpleCsvParser as simpleCsvParser
 * @borrows string.csvLineParse as csvLineParse
 * @borrows string.trimRight as trimRight
 * @borrows string.trimLeft as trimLeft
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
    simpleCsvParser: function() {
        return _simpleCsvParser.default;
    },
    csvLineParse: function() {
        return _simpleCsvParser.default;
    },
    trimRight: function() {
        return _trimRight.default;
    },
    trimLeft: function() {
        return _trimLeft.default;
    }
});
var _quote = /*#__PURE__*/ _interop_require_default(require("./quote"));
var _unquote = /*#__PURE__*/ _interop_require_default(require("./unquote"));
var _isQuoted = /*#__PURE__*/ _interop_require_default(require("./isQuoted"));
var _isWrappedWith = /*#__PURE__*/ _interop_require_default(require("./isWrappedWith"));
var _bin2Hex = /*#__PURE__*/ _interop_require_default(require("./bin2Hex"));
var _compile = /*#__PURE__*/ _interop_require_default(require("./compile"));
var _template = /*#__PURE__*/ _interop_require_default(require("./template"));
var _replaceAll = /*#__PURE__*/ _interop_require_default(require("./replaceAll"));
var _dropIfEndsWith = /*#__PURE__*/ _interop_require_default(require("./dropIfEndsWith"));
var _dropIfStartsWith = /*#__PURE__*/ _interop_require_default(require("./dropIfStartsWith"));
var _ensureEndsWith = /*#__PURE__*/ _interop_require_default(require("./ensureEndsWith"));
var _ensureStartsWith = /*#__PURE__*/ _interop_require_default(require("./ensureStartsWith"));
var _simpleCsvParser = /*#__PURE__*/ _interop_require_default(require("./simpleCsvParser"));
var _trimRight = /*#__PURE__*/ _interop_require_default(require("./trimRight"));
var _trimLeft = /*#__PURE__*/ _interop_require_default(require("./trimLeft"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

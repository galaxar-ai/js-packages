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
    ifThen: function() {
        return _ifThen.default;
    },
    hookInvoke: function() {
        return _hookInvoke.default;
    },
    sleep_: function() {
        return _sleep_.default;
    },
    waitUntil_: function() {
        return _waitUntil_.default;
    },
    isInteger: function() {
        return _isInteger.default;
    }
});
var _ifThen = /*#__PURE__*/ _interop_require_default(require("./ifThen"));
var _hookInvoke = /*#__PURE__*/ _interop_require_default(require("./hookInvoke"));
var _sleep_ = /*#__PURE__*/ _interop_require_default(require("./sleep_"));
var _waitUntil_ = /*#__PURE__*/ _interop_require_default(require("./waitUntil_"));
var _isInteger = /*#__PURE__*/ _interop_require_default(require("./isInteger"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

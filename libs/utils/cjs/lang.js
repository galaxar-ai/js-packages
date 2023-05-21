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
    isPlainObject: function() {
        return _isPlainObject.default;
    },
    isInteger: function() {
        return _isInteger.default;
    },
    toInteger: function() {
        return _toInteger.default;
    },
    toBoolean: function() {
        return _toBoolean.default;
    },
    toFloat: function() {
        return _toFloat.default;
    },
    esmCheck: function() {
        return _esmCheck.default;
    },
    esmIsMain: function() {
        return _esmIsMain.default;
    }
});
const _ifThen = /*#__PURE__*/ _interop_require_default(require("./ifThen"));
const _hookInvoke = /*#__PURE__*/ _interop_require_default(require("./hookInvoke"));
const _sleep_ = /*#__PURE__*/ _interop_require_default(require("./sleep_"));
const _waitUntil_ = /*#__PURE__*/ _interop_require_default(require("./waitUntil_"));
const _isPlainObject = /*#__PURE__*/ _interop_require_default(require("./isPlainObject"));
const _isInteger = /*#__PURE__*/ _interop_require_default(require("./isInteger"));
const _toInteger = /*#__PURE__*/ _interop_require_default(require("./toInteger"));
const _toBoolean = /*#__PURE__*/ _interop_require_default(require("./toBoolean"));
const _toFloat = /*#__PURE__*/ _interop_require_default(require("./toFloat"));
const _esmCheck = /*#__PURE__*/ _interop_require_default(require("./esmCheck"));
const _esmIsMain = /*#__PURE__*/ _interop_require_default(require("./esmIsMain"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=lang.js.map
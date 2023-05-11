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
const _toBoolean = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/toBoolean"));
const _functions = require("./functions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    name: 'boolean',
    alias: [
        'bool'
    ],
    defaultValue: false,
    validate: (value)=>typeof value === 'boolean',
    sanitize: (value, meta, i18n)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        return (0, _toBoolean.default)(value);
    },
    serialize: _functions.identity
};

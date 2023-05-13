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
const _types = require("./types");
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
    sanitize: (value, meta, i18n, path)=>{
        const [isDone, sanitized] = (0, _types.beginSanitize)(value, meta, i18n, path);
        if (isDone) return sanitized;
        return (0, _toBoolean.default)(value);
    },
    serialize: _functions.identity
};

//# sourceMappingURL=boolean.js.map
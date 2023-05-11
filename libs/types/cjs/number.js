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
const _errors = require("./errors");
const _toFloat = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/toFloat"));
const _functions = require("./functions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    name: 'number',
    alias: [
        'float',
        'double'
    ],
    defaultValue: 0,
    validate: (value)=>typeof value === 'number',
    sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        const raw = value;
        value = (0, _toFloat.default)(value);
        if (isNaN(value)) {
            throw new _errors.ValidationError('Invalid number value.', {
                value: raw,
                meta,
                i18n,
                path
            });
        }
        return value;
    },
    serialize: _functions.identity
};

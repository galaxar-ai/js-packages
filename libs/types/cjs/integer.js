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
const _toInteger = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/toInteger"));
const _functions = require("./functions");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    name: 'integer',
    alias: [
        'int'
    ],
    defaultValue: 0,
    validate: (value)=>typeof value === 'number' && Number.isInteger(value),
    sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        const raw = value;
        value = (0, _toInteger.default)(value);
        if (isNaN(value)) {
            throw new _errors.ValidationError('Invalid integer value.', {
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

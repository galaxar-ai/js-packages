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
const _each = /*#__PURE__*/ _interop_require_default(require("lodash/each"));
const _errors = require("./errors");
const _types = require("./types");
const _pathUtils = require("@galaxar/utils/pathUtils");
const _isPlainObject = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/isPlainObject"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const jsonStarter = new Set([
    '"',
    '[',
    '{'
]);
const jsonEnding = {
    '"': '"',
    '[': ']',
    '{': '}'
};
const _default = {
    name: 'object',
    alias: [
        'json'
    ],
    defaultValue: {},
    validate: (value)=>(0, _isPlainObject.default)(value),
    sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        const raw = value;
        const type = typeof value;
        if (type === 'string') {
            if (value.length > 1 && jsonStarter.has(value[0]) && jsonEnding[value[0]] === value[value.length - 1]) {
                value = JSON.parse(value);
            }
        }
        if (meta.schema) {
            if (typeof value !== 'object') {
                throw new _errors.ValidationError('Invalid object value.', {
                    value: raw,
                    meta,
                    i18n,
                    path
                });
            }
            const schema = typeof meta.schema === 'function' ? meta.schema() : meta.schema;
            const newValue = {};
            (0, _each.default)(schema, (validationObject, fieldName)=>{
                const fieldValue = value[fieldName];
                newValue[fieldName] = _types.Types.sanitize(fieldValue, validationObject, i18n, (0, _pathUtils.makePath)(path, fieldName));
            });
            if (meta.keepUnsanitized) {
                return {
                    ...value,
                    ...newValue
                };
            }
            return newValue;
        }
        return value;
    },
    serialize: (value)=>{
        if (value == null) return null;
        return (0, _types.safeJsonStringify)(value);
    }
};

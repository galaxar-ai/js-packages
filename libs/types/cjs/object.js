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
const _objectPathUtils = require("@galaxar/utils/objectPathUtils");
const _isPlainObject = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/isPlainObject"));
const _batchAsync_ = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/batchAsync_"));
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
class T_OBJECT {
    validate(value) {
        return (0, _isPlainObject.default)(value);
    }
    _sanitize(value, meta, opts) {
        const type = typeof value;
        if (type === 'string') {
            if (value.length > 1 && jsonStarter.has(value[0]) && jsonEnding[value[0]] === value[value.length - 1]) {
                value = JSON.parse(value);
            }
        }
        if (meta.schema) {
            if (typeof value !== 'object') {
                throw new _errors.ValidationError('Invalid object value.', {
                    value,
                    meta,
                    ...opts
                });
            }
            const schema = typeof meta.schema === 'function' ? meta.schema() : meta.schema;
            const newValue = {};
            (0, _each.default)(schema, (validationObject, fieldName)=>{
                const fieldValue = value[fieldName];
                const _fieldValue = this.system.sanitize(fieldValue, validationObject, opts.i18n, (0, _objectPathUtils.makePath)(opts.path, fieldName));
                if (_fieldValue != null || fieldName in value) {
                    newValue[fieldName] = _fieldValue;
                }
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
    }
    async _sanitizeAsync(value, meta, opts) {
        const type = typeof value;
        if (type === 'string') {
            if (value.length > 1 && jsonStarter.has(value[0]) && jsonEnding[value[0]] === value[value.length - 1]) {
                value = JSON.parse(value);
            }
        }
        if (meta.schema) {
            if (typeof value !== 'object') {
                throw new _errors.ValidationError('Invalid object value.', {
                    value,
                    meta,
                    ...opts
                });
            }
            const schema = typeof meta.schema === 'function' ? meta.schema() : meta.schema;
            const newValue = {};
            await (0, _batchAsync_.default)(schema, async (validationObject, fieldName)=>{
                const fieldValue = value[fieldName];
                const _fieldValue = await this.system.sanitize_(fieldValue, validationObject, opts.i18n, (0, _objectPathUtils.makePath)(opts.path, fieldName));
                if (_fieldValue != null || fieldName in value) {
                    newValue[fieldName] = _fieldValue;
                }
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
    }
    serialize(value) {
        if (value == null) return null;
        return this.system.safeJsonStringify(value);
    }
    constructor(system){
        _define_property(this, "name", 'object');
        _define_property(this, "alias", [
            'json'
        ]);
        _define_property(this, "primitive", true);
        _define_property(this, "defaultValue", {});
        this.system = system;
    }
}
;
const _default = T_OBJECT;

//# sourceMappingURL=object.js.map
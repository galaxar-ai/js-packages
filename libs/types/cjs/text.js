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
const _functions = require("./functions");
const _errors = require("./errors");
const _default = {
    name: 'text',
    alias: [
        'string'
    ],
    defaultValue: '',
    validate: (value)=>typeof value === 'string',
    sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        if (value === '' && meta.emptyAsNull) {
            return null;
        }
        if (typeof value !== 'string') {
            throw new _errors.ValidationError('Invalid text value.', {
                value,
                meta,
                i18n,
                path
            });
        }
        return value;
    },
    serialize: _functions.identity
};

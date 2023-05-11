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
const _types = require("./types");
const _default = {
    name: 'bigint',
    alias: [
        'biginteger'
    ],
    defaultValue: 0n,
    validate: (value)=>typeof value === 'bigint',
    sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        const raw = value;
        try {
            value = BigInt(value);
        } catch (e) {
            throw new _errors.ValidationError('Invalid bigint value.', {
                value: raw,
                meta,
                i18n,
                path
            }, e);
        }
        return value;
    },
    serialize: (value)=>value == null ? null : _types.Plugins['bigintWriter'] ? _types.Plugins['bigintWriter'](value) : value.toString()
};

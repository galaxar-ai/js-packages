"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _errors = require("./errors");
module.exports = {
    name: 'binary',
    alias: [
        'blob',
        'buffer'
    ],
    defaultValue: null,
    validate: (value)=>value instanceof Buffer,
    sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        if (value instanceof Buffer) {
            return value;
        }
        if (typeof value === 'string') {
            return Buffer.from(value, meta.encoding || 'base64');
        }
        throw new _errors.ValidationError('Invalid binary value.', {
            value,
            meta,
            i18n,
            path
        });
    },
    serialize: (value, meta)=>value == null ? null : value.toString(meta.encoding || 'base64')
};

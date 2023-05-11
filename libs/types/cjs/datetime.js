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
const _types = require("./types");
const _errors = require("./errors");
const _default = {
    name: 'datetime',
    alias: [
        'date',
        'time',
        'timestamp'
    ],
    defaultValue: new Date(0),
    validate: (value)=>value instanceof Date,
    /**
     * Transform a value into a JavaScript Date object.
     * @param {*} value 
     * @param {*} meta 
     * @param {*} i18n 
     * @param {string} [path]
     * @returns {Date|null}
     */ sanitize: (value, meta, i18n, path)=>{
        if (value == null) return null;
        if (meta.rawValue) return value;
        const raw = value;
        if (value instanceof Date) {
            return value;
        } else {
            const type = typeof value;
            if (type === 'string') {
                if (meta.format) {
                    const parser = _types.Plugins['datetimeParser'];
                    if (!parser) {
                        throw new _errors.ApplicationError('Missing datetime parser plugin.');
                    }
                    value = parser(value, {
                        format: meta.format,
                        timezone: i18n?.timezone
                    });
                } else {
                    value = new Date(value);
                }
            } else if (type === 'number') {
                value = new Date(value);
            } else if (value.toJSDate) {
                value = value.toJSDate();
            }
            if (isNaN(value)) {
                throw new _errors.ValidationError('Invalid datetime value.', {
                    value: raw,
                    meta,
                    i18n,
                    path
                });
            }
        }
        return value;
    },
    serialize: (value)=>{
        return value?.toISOString();
    }
};

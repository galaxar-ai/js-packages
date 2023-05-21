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
const _types = require("./types");
const T_ANY = {
    name: 'any',
    alias: [
        '*'
    ],
    defaultValue: null,
    validate: _functions.everTrue,
    sanitize: (value, meta, i18n, path)=>{
        const [isDone, sanitized] = (0, _types.beginSanitize)(value, meta, i18n, path);
        if (isDone) return sanitized;
        return value;
    },
    serialize: (value)=>typeof value === 'object' ? JSON.stringify(value) : value
};
const _default = T_ANY;

//# sourceMappingURL=any.js.map
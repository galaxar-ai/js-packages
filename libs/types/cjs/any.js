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
const T_ANY = {
    name: "any",
    alias: [
        "*"
    ],
    defaultValue: null,
    validate: _functions.everTrue,
    sanitize: _functions.identity,
    serialize: (value)=>typeof value === "object" ? JSON.stringify(value) : value
};
const _default = T_ANY;

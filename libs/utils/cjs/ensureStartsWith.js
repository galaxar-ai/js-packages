/**
 * Ensure a string starts with *starting*
 * @function string.ensureStartsWith
 * @param {String} str
 * @param {String} starting
 * @returns {String}
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var ensureStartsWith = function(str, starting) {
    return str ? str.startsWith(starting) ? str : starting + str : starting;
};
var _default = ensureStartsWith;

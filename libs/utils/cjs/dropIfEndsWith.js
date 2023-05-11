/**
 * Drop a right part of a string if it ends with *ending*
 * @function string.dropIfEndsWith
 * @param {String} str
 * @param {String} ending
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
var dropIfEndsWith = function(str, ending) {
    return str && str.endsWith(ending) ? str.substring(0, str.length - ending.length) : str;
};
var _default = dropIfEndsWith;

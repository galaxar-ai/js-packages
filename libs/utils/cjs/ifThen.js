/**
 * Shortcut function for returning an alternative value if predicate returns true
 * @alias lang.ifThen
 * @param {*} obj
 * @param {*} predicate
 * @param {*} then
 * @returns {*} Returns *then* if predicate(obj) is true, otherwise returns the original obj
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
var ifThen = function(obj, predicate, then) {
    return predicate(obj) ? then : obj;
};
var _default = ifThen;

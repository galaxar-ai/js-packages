/**
 * Check a variable whether is plain object.
 * 20x fasters than lodash
 * @alias object.isPlainObject
 * @param {*} any
 * @see [benchmark]{@link https://www.measurethat.net/Benchmarks/Show/11574/0/lodash-isplainobject-vs-js-constructor-check-with-more}
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
var isPlainObject = function(any) {
    return any != null && (any.constructor === Object || typeof any === "object" && Object.getPrototypeOf(any) === null);
};
var _default = isPlainObject;

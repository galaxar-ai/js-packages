/**
 * Stringify an object into url query string.
 * @function string.urlObjectToQueryString
 * @param {Object} obj
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
function objectToQueryString(obj, excludeNullValue) {
    var parts = [];
    for(var k in obj){
        var v = obj[k];
        var part = void 0;
        if (v != null) {
            part = encodeURIComponent(k) + "=" + encodeURIComponent(v);
        } else if (excludeNullValue) {
            continue;
        } else {
            part = encodeURIComponent(k);
        }
        parts.push(part);
    }
    return parts.join("&");
}
var _default = objectToQueryString;

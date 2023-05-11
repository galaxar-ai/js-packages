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
var trimLeft = function(str, char) {
    var l = str.length;
    var i = 0;
    for(; i < l; i++){
        if (str[i] !== char) break;
    }
    return i > 0 ? str.substring(i) : str;
};
var _default = trimLeft;

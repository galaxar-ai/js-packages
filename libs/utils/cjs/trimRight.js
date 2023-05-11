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
var trimRight = function(str, char) {
    var l = str.length - 1;
    var i = l;
    for(; i > 0; i--){
        if (str[i] !== char) break;
    }
    return i < l ? str : str.substring(0, i);
};
var _default = trimRight;

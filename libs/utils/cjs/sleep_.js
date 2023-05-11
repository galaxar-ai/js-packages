/**
 * Sleep for milliseconds
 * @alias lang.sleep_
 * @async
 * @param {integer} ms - milliseconds
 * @returns {Promise}
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
var sleep_ = function(ms) {
    return new Promise(function(resolve /*, reject*/ ) {
        setTimeout(resolve, ms);
    });
};
var _default = sleep_;

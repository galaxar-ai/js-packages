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
var _sleep_ = /*#__PURE__*/ _interop_require_default(require("./sleep_"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function waitUntil_(checker) {
    return _waitUntil_.apply(this, arguments);
}
function _waitUntil_() {
    _waitUntil_ = /**
 * Run the checker every given duration for certain rounds until the checker returns non-false value.
 * @alias lang.waitUntil_
 * @async
 * @param {Function} checker - predicator
 * @param {integer} [checkInterval=1000]
 * @param {integer} [maxRounds=10]
 * @returns {Promise.<boolean>}
 */ _async_to_generator(function(checker) {
        var checkInterval, maxRounds, result, counter;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    checkInterval = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : 1000, maxRounds = _arguments.length > 2 && _arguments[2] !== void 0 ? _arguments[2] : 10;
                    return [
                        4,
                        checker()
                    ];
                case 1:
                    result = _state.sent();
                    if (result) return [
                        2,
                        result
                    ];
                    counter = 0;
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        (0, _sleep_.default)(checkInterval)
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        checker()
                    ];
                case 4:
                    result = _state.sent();
                    if (result) {
                        return [
                            3,
                            6
                        ];
                    }
                    _state.label = 5;
                case 5:
                    if (++counter < maxRounds) return [
                        3,
                        2
                    ];
                    _state.label = 6;
                case 6:
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _waitUntil_.apply(this, arguments);
}
var _default = waitUntil_;

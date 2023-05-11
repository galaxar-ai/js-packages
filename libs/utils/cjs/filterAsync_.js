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
var _isPlainObject = /*#__PURE__*/ _interop_require_default(require("./isPlainObject"));
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
function filterAsync_(obj, asyncPredicate) {
    return _filterAsync_.apply(this, arguments);
}
function _filterAsync_() {
    _filterAsync_ = /**
 * Iterates over elements of collection asynchronously, returning an array of all elements predicate returns truthy for.
 * The predicate is invoked asynchronously with three arguments: (value, index|key, collection).
 * @alias collection.filterAsync_
 * @async
 * @param {Array|Object} obj
 * @param {asyncIterator} asyncPredicate
 * @returns {Promise.<Object|undefined>}
 */ _async_to_generator(function(obj, asyncPredicate) {
        var r, l, i, el, r1, _tmp, _tmp1, _i, k, el1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!Array.isArray(obj)) return [
                        3,
                        5
                    ];
                    r = [];
                    l = obj.length;
                    i = 0;
                    _state.label = 1;
                case 1:
                    if (!(i < l)) return [
                        3,
                        4
                    ];
                    el = obj[i];
                    return [
                        4,
                        asyncPredicate(el, i, obj)
                    ];
                case 2:
                    if (_state.sent()) {
                        r.push(el);
                    }
                    _state.label = 3;
                case 3:
                    i++;
                    return [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2,
                        r
                    ];
                case 5:
                    if (!(0, _isPlainObject.default)(obj)) return [
                        3,
                        10
                    ];
                    r1 = {};
                    _tmp = [];
                    for(_tmp1 in obj)_tmp.push(_tmp1);
                    _i = 0;
                    _state.label = 6;
                case 6:
                    if (!(_i < _tmp.length)) return [
                        3,
                        9
                    ];
                    k = _tmp[_i];
                    if (!Object.prototype.hasOwnProperty.call(obj, k)) return [
                        3,
                        8
                    ];
                    el1 = obj[k];
                    return [
                        4,
                        asyncPredicate(el1, k, obj)
                    ];
                case 7:
                    if (_state.sent()) {
                        r1[k] = el1;
                    }
                    _state.label = 8;
                case 8:
                    _i++;
                    return [
                        3,
                        6
                    ];
                case 9:
                    return [
                        2,
                        r1
                    ];
                case 10:
                    return [
                        2,
                        Promise.reject("Invalid argument!")
                    ];
                case 11:
                    return [
                        2
                    ];
            }
        });
    });
    return _filterAsync_.apply(this, arguments);
}
var _default = filterAsync_;

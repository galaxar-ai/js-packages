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
var _isEqual = /*#__PURE__*/ _interop_require_default(require("lodash/isEqual"));
var _reduce = /*#__PURE__*/ _interop_require_default(require("lodash/reduce"));
var _isEmpty = /*#__PURE__*/ _interop_require_default(require("lodash/isEmpty"));
var _differenceWith = /*#__PURE__*/ _interop_require_default(require("lodash/differenceWith"));
var _ifThen = /*#__PURE__*/ _interop_require_default(require("./ifThen"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var arrayOperators = [
    function() {
        return [];
    },
    function(array, k, v) {
        return array.push(v);
    }
];
var objectOperators = [
    function() {
        return {};
    },
    function(obj, k, v) {
        return obj[k] = v;
    }
];
function _diff(base, object, creator, setter) {
    return (0, _reduce.default)(object, function(re, v, k) {
        var vb = base[k];
        var tb = typeof vb === "undefined" ? "undefined" : _type_of(vb);
        var to = typeof v === "undefined" ? "undefined" : _type_of(v);
        if (tb !== to) {
            // different type at all
            setter(re, k, v);
        } else if (typeof vb === "object") {
            // both are object
            if (Array.isArray(vb)) {
                // both are array
                var avd = (0, _differenceWith.default)(v, vb, _isEqual.default);
                if (avd.length > 0) {
                    setter(re, k, avd);
                }
            } else if (!(0, _isEqual.default)(vb, v)) {
                // object
                var baseIsEmpty = (0, _isEmpty.default)(vb);
                if ((0, _isEmpty.default)(v)) {
                    if (!baseIsEmpty) {
                        setter(re, k, v);
                    }
                } else {
                    if (baseIsEmpty) {
                        setter(re, k, v);
                    } else {
                        // both not empty
                        var vd = _diff(vb, v, objectOperators[0], objectOperators[1]);
                        if (!(0, _isEmpty.default)(vd)) {
                            setter(re, k, vd);
                        }
                    }
                }
            }
        } else if (vb !== v) {
            setter(re, k, v);
        }
        return re;
    }, creator());
}
/**
 * Deep diff between two object
 * @alias object.difference
 * @param  {Object} base - Object to be compared
 * @param  {Object} object - Object compared
 * @return {Object} Return the key-value pair from object which of the value is different from base with the same key, or undefined if no difference
 */ function difference(base, object) {
    var ops = Array.isArray(base) ? arrayOperators : objectOperators;
    var baseIsEmpty = (0, _isEmpty.default)(base);
    return (0, _isEmpty.default)(object) ? baseIsEmpty ? undefined : object : baseIsEmpty ? object : (0, _ifThen.default)(_diff(base, object, ops[0], ops[1]), _isEmpty.default, undefined);
}
var _default = difference;

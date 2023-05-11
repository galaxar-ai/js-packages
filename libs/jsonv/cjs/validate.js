// JSON Validation Syntax 
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    invalidType: function() {
        return invalidType;
    },
    test: function() {
        return test;
    },
    default: function() {
        return _default;
    }
});
const _utils = require("@galaxar/utils");
const _JvsError = /*#__PURE__*/ _interop_require_default(require("./JvsError"));
const _config = /*#__PURE__*/ _interop_require_wildcard(require("./config"));
const _validateOperators = /*#__PURE__*/ _interop_require_default(require("./validateOperators"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const MSG = _config.default.messages;
function getUnmatchedExplanation(op, leftValue, rightValue, context) {
    if (context.$$ERROR) {
        return context.$$ERROR;
    }
    if (!MSG.validationErrors) {
        throw new Error('Please import locale first before using validators.');
    }
    const getter = MSG.validationErrors[op];
    return getter(context.name, leftValue, rightValue, context);
}
function invalidType(value, type, options, context) {
    const reason = MSG.validationErrors[_validateOperators.default.TYPE](context.name, value, type, context);
    if (options.throwError) {
        throw new _JvsError.default(reason, value, context.path);
    }
    return options.plainError ? reason : new _JvsError.default(reason, value, context.path);
}
function test(left, op, right, options, context) {
    const handler = _config.default.getValidator(op);
    if (!handler) {
        throw new Error(MSG.INVALID_TEST_HANLDER(op));
    }
    return handler(left, right, options, context);
}
/**
 * Validate the given object with JSON Expression Syntax (JES)
 * @param {*} actual - The object to match
 * @param {*} jvs - Expected state in JSON Expression Syntax
 * @param {*} options - Validation options
 * @param {*} context - Validation context
 * @returns {array} - [ {boolean} matched, {string} unmatchedReason ]
 */ function validate(actual, jvs, options = {
    throwError: true,
    abortEarly: true
}, context = {}) {
    const type = typeof jvs;
    if (type === 'string') {
        if (jvs.length === 0 || jvs[0] !== '$') {
            throw new Error(MSG.SYNTAX_INVALID_EXPR(jvs));
        }
        if (jvs.startsWith('$$')) {
            return validate(actual, {
                $equal: jvs
            }, options, context);
        }
        return validate(actual, {
            [jvs]: null
        }, options, context);
    }
    const { throwError , abortEarly , asPredicate , plainError  } = options;
    if (jvs == null) {
        return true;
    }
    if (type !== 'object') {
        throw new Error(MSG.SYNTAX_INVALID_EXPR(jvs));
    }
    let { path  } = context;
    const errors = [];
    const _options = !abortEarly && throwError ? {
        ...options,
        throwError: false
    } : options;
    for(let operator in jvs){
        let op, left, _context;
        const opValue = jvs[operator];
        if (// $match
        operator.length > 1 && operator[0] === '$' || // |>$all
        operator.length > 3 && operator[0] === '|' && operator[2] === '$') {
            //validator
            op = _config.default.getValidatorTag(operator);
            if (!op) {
                throw new Error(MSG.UNSUPPORTED_VALIDATION_OP(operator, path));
            }
            left = actual;
            _context = context;
        } else {
            const fieldName = operator;
            let complexKey = fieldName.indexOf('.') !== -1;
            //pick a field and then apply manipulation
            left = actual != null ? complexKey ? (0, _utils.get)(actual, fieldName) : actual[fieldName] : undefined;
            _context = (0, _config.getChildContext)(context, actual, fieldName, left);
            if (opValue != null && (0, _utils.isPlainObject)(opValue)) {
                op = _validateOperators.default.MATCH;
            } else {
                op = _validateOperators.default.EQUAL;
            }
        }
        if (!test(left, op, opValue, _options, _context)) {
            if (asPredicate) {
                return false;
            }
            const reason = getUnmatchedExplanation(op, left, opValue, _context);
            if (abortEarly && throwError) {
                throw new _JvsError.default(reason, left, _context.path);
            }
            errors.push(plainError ? reason : new _JvsError.default(reason, left, _context.path));
            if (abortEarly) {
                break;
            }
        }
    }
    if (errors.length > 0) {
        if (asPredicate) {
            return false;
        }
        if (throwError) {
            throw new _JvsError.default(errors, actual, path);
        }
        return errors.length === 1 && plainError ? errors[0] : errors;
    }
    return true;
}
const _default = validate;

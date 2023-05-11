// JSON Validation Syntax 
import { isPlainObject, get as _get } from '@galaxar/utils';
import JsvError from './JvsError';
import config, { getChildContext } from './config';
import ops from './validateOperators';

const MSG = config.messages;

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

export function invalidType(value, type, options, context) {
    const reason = MSG.validationErrors[ops.TYPE](context.name, value, type, context);

    if (options.throwError) {
        throw new JsvError(reason, value, context.path);
    }

    return options.plainError ? reason : new JsvError(reason, value, context.path);
}

export function test(left, op, right, options, context) {
    const handler = config.getValidator(op);

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
 */
function validate(actual, jvs, options = { throwError: true, abortEarly: true }, context = {}) {
    const type = typeof jvs;

    if (type === 'string') {
        if (jvs.length === 0 || jvs[0] !== '$') {
            throw new Error(MSG.SYNTAX_INVALID_EXPR(jvs));
        }

        if (jvs.startsWith('$$')) {
            return validate(actual, { $equal: jvs }, options, context); 
        }

        return validate(actual, { [jvs]: null }, options, context);
    }

    const { throwError, abortEarly, asPredicate, plainError } = options;

    if (jvs == null) {
        return true;
    }

    if (type !== 'object') {
        throw new Error(MSG.SYNTAX_INVALID_EXPR(jvs));
    }

    let { path } = context;
    const errors = [];
    const _options = !abortEarly && throwError ? { ...options, throwError: false } : options;

    for (let operator in jvs) {
        let op, left, _context; 

        const opValue = jvs[operator];

        if (
            // $match
            (operator.length > 1 && operator[0] === '$') ||
            // |>$all
            (operator.length > 3 && operator[0] === '|' && operator[2] === '$')
        ) {
            //validator
            op = config.getValidatorTag(operator);
            if (!op) {
                throw new Error(MSG.UNSUPPORTED_VALIDATION_OP(operator, path));
            }

            left = actual;
            _context = context;
        } else {
            const fieldName = operator;
            let complexKey = fieldName.indexOf('.') !== -1;

            //pick a field and then apply manipulation
            left = actual != null ? (complexKey ? _get(actual, fieldName) : actual[fieldName]) : undefined;

            _context = getChildContext(context, actual, fieldName, left);

            if (opValue != null && isPlainObject(opValue)) {
                op = ops.MATCH;
            } else {
                op = ops.EQUAL;
            }
        }

        if (!test(left, op, opValue, _options, _context)) {
            if (asPredicate) {
                return false;
            }

            const reason = getUnmatchedExplanation(op, left, opValue, _context);
            if (abortEarly && throwError) {
                throw new JsvError(reason, left, _context.path);
            }

            errors.push(plainError ? reason : new JsvError(reason, left, _context.path));
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
            throw new JsvError(errors, actual, path);
        }

        return errors.length === 1 && plainError ? errors[0] : errors;
    }

    return true;
}

export default validate;

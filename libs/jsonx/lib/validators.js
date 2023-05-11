// JSON Expression Syntax (JES) for validation
import _isEqual from 'lodash/isEqual';
import _has from 'lodash/has';
import _size from 'lodash/size';
import _castArray from 'lodash/castArray';

import ValidationError from './ValidationError';
import validate, { test } from './validate';

import config from './config';
import Types from './types';
import ops from './validateOperators';
import { isPlainObject } from '@genx/july';
import transform from './transform';

const MSG = config.messages;

const processRightValue = (right, context) =>
    typeof right === 'string' || isPlainObject(right) ? transform(undefined, right, context, true) : right;

//Validators [ name, ...operator alias ]
const OP_EQUAL = [ops.EQUAL, '$eq', '$eql', '$equal', '$being'];
const OP_NOT_EQUAL = [ops.NOT_EQUAL, '$ne', '$neq', '$notEqual'];
const OP_NOT = [ops.NOT, '$not'];
const OP_GREATER_THAN = [ops.GREATER_THAN, '$gt', '$>', '$greaterThan'];
const OP_GREATER_THAN_OR_EQUAL = [ops.GREATER_THAN_OR_EQUAL, '$gte', '$>=', '$greaterThanOrEqual', '$min'];
const OP_LESS_THAN = [ops.LESS_THAN, '$lt', '$<', '$lessThan'];
const OP_LESS_THAN_OR_EQUAL = [ops.LESS_THAN_OR_EQUAL, '$lte', '$<=', '$lessThanOrEqual', '$max'];
const OP_LENGTH = [ops.LENGTH, '$length', '$size', '$capacity'];
const OP_IN = [ops.IN, '$in'];
const OP_NOT_IN = [ops.NOT_IN, '$nin', '$notIn'];
const OP_EXISTS = [ops.EXISTS, '$exist', '$exists', '$notNull'];
const OP_REQUIRED = [ops.REQUIRED, '$required', '$mandatory'];
const OP_MATCH = [ops.MATCH, '$has', '$match', '$all', '$should'];
const OP_MATCH_ANY = [ops.MATCH_ANY, '$any', '$or', '$either'];
const OP_ALL_MATCH = [ops.ALL_MATCH, '$allMatch', '|>$all', '|>$match'];
const OP_ANY_ONE_MATCH = [ops.ANY_ONE_MATCH, '$anyOneMatch', '|*$any', '|*$match', '|*$either'];
const OP_TYPE = [ops.TYPE, '$is', '$typeOf'];
const OP_HAS_KEYS = [ops.HAS_KEYS, '$hasKey', '$hasKeys', '$withKey', '$withKeys'];
const OP_START_WITH = [ops.START_WITH, '$startWith', '$startsWith'];
const OP_END_WITH = [ops.END_WITH, '$endWith', '$endsWith'];
const OP_SAME_AS = [ops.SAME_AS, '$sameAs'];

config.addValidatorToMap(OP_EQUAL, (left, right, options, context) =>
    _isEqual(left, processRightValue(right, context))
);
config.addValidatorToMap(
    OP_NOT_EQUAL,
    (left, right, options, context) => !_isEqual(left, processRightValue(right, context))
);
config.addValidatorToMap(OP_NOT, (left, ...args) => !test(left, ops.MATCH, ...args));
config.addValidatorToMap(OP_GREATER_THAN, (left, right, options, context) => left > processRightValue(right, context));
config.addValidatorToMap(
    OP_GREATER_THAN_OR_EQUAL,
    (left, right, options, context) => left >= processRightValue(right, context)
);
config.addValidatorToMap(OP_LESS_THAN, (left, right, options, context) => left < processRightValue(right, context));
config.addValidatorToMap(
    OP_LESS_THAN_OR_EQUAL,
    (left, right, options, context) => left <= processRightValue(right, context)
);
config.addValidatorToMap(OP_LENGTH, (left, right, options, context) =>
    test(_size(left), ops.MATCH, right, options, context)
);

config.addValidatorToMap(OP_IN, (left, right, options, context) => {
    if (right == null) {
        return false;
    }

    right = processRightValue(right, context);

    if (!Array.isArray(right)) {
        throw new Error(MSG.OPERAND_NOT_ARRAY(ops.IN));
    }

    const equal = config.getValidator(ops.EQUAL);
    return right.find((element) => equal(left, element));
});

config.addValidatorToMap(OP_NOT_IN, (left, right, options, context) => {
    if (right == null) {
        return true;
    }

    right = processRightValue(right, context);

    if (!Array.isArray(right)) {
        throw new Error(MSG.OPERAND_NOT_ARRAY(ops.NOT_IN));
    }

    const notEqual = config.getValidator(ops.NOT_EQUAL);

    return right.every((element) => notEqual(left, element));
});

config.addValidatorToMap(OP_EXISTS, (left, right) => {
    if (typeof right !== 'boolean') {
        throw new Error(MSG.OPERAND_NOT_BOOL(ops.EXISTS));
    }

    return right ? left != null : left == null;
});

config.addValidatorToMap(OP_REQUIRED, (left, right) => {
    if (typeof right !== 'boolean') {
        throw new Error(MSG.OPERAND_NOT_BOOL(ops.OP_REQUIRED));
    }

    return right ? left != null : true;
});

config.addValidatorToMap(OP_MATCH, (left, right, options, context) => {
    if (Array.isArray(right)) {
        const errors = [];

        right.every((rule) => {
            const reason = validate(left, rule, { ...options, asPredicate: false }, context);
            if (reason !== true) {
                errors.push(..._castArray(reason));

                if (options.abortEarly) {
                    return false;
                }
            }

            return true;
        });

        if (errors.length > 0) {
            if (options.throwError) {
                throw new ValidationError(errors, left, context.path);
            }

            if (!options.asPredicate) {
                context.$$ERROR = errors.length === 1 && options.plainError ? errors[0] : errors;
            }

            return false;
        }

        return true;
    }

    const reason2 = validate(left, right, options, context);
    if (reason2 !== true) {
        if (!options.asPredicate) {
            context.$$ERROR = reason2;
        }

        return false;
    }

    return true;
});

config.addValidatorToMap(OP_MATCH_ANY, (left, right, options, context) => {
    if (!Array.isArray(right)) {
        throw new Error(MSG.OPERAND_NOT_ARRAY(ops.MATCH_ANY));
    }

    let found = right.find((rule) => {
        const reason = validate(left, rule, { ...options, abortEarly: false, throwError: false }, context);
        return reason === true;
    });

    if (!found) {
        context.$$ERROR = MSG.validationErrors[ops.MATCH_ANY](context.name, left, right, context);
    }

    return found ? true : false;
});

config.addValidatorToMap(OP_ALL_MATCH, (left, right, options, context) => {
    if (!Array.isArray(left)) {
        throw new Error(MSG.VALUE_NOT_ARRAY(ops.ALL_MATCH));
    }

    const errors = [];

    left.every((leftItem) => {
        const reason = validate(leftItem, right, { ...options, asPredicate: false }, context);
        if (reason !== true) {
            errors.push(MSG.validationErrors[ops.ALL_MATCH](context.name, left, right, context), ..._castArray(reason));

            if (options.abortEarly) {
                return false;
            }
        }

        return true;
    });

    if (errors.length > 0) {
        if (options.throwError) {
            throw new ValidationError(errors, left, context.path);
        }

        if (!options.asPredicate) {
            context.$$ERROR = errors.length === 1 && options.plainError ? errors[0] : errors;
        }

        return false;
    }

    return true;
});

config.addValidatorToMap(OP_ANY_ONE_MATCH, (left, right, options, context) => {
    if (!Array.isArray(left)) {
        throw new Error(MSG.VALUE_NOT_ARRAY(ops.ANY_ONE_MATCH));
    }

    let found = left.find((leftItem) => {
        const reason = validate(leftItem, right, { ...options, abortEarly: false, throwError: false }, context);
        return reason === true;
    });

    if (!found) {
        context.$$ERROR = MSG.validationErrors[ops.ANY_ONE_MATCH](context.name, left, right, context);
    }

    return found ? true : false;
});

config.addValidatorToMap(OP_TYPE, (left, right, options, context) => {
    let type;
    let schema;

    if (Array.isArray(right)) {
        if (right.length === 0) {
            throw new Error(MSG.INVALID_OP_EXPR(OP_TYPE[0], right));
        }

        type = right[0];
        if (right.length > 1) {
            schema = right[1];
        }
    } else if (typeof right === 'string') {
        type = right;
    } else if (typeof right === 'object') {
        type = right.type;
        schema = right.schema;
    }

    if (!Types.Builtin.has(type)) {
        throw new Error(MSG.UNSUPPORTED_TYPE(type));
    }

    const reason = Types[type].validate(left, schema, options, context);
    if (reason !== true) {
        context.$$ERROR = reason;
        return false;
    }

    return true;
});

config.addValidatorToMap(OP_HAS_KEYS, (left, right) => {
    if (typeof left !== 'object') {
        return false;
    }

    return Array.isArray(right) ? right.every((key) => _has(left, key)) : _has(left, right);
});

config.addValidatorToMap(OP_START_WITH, (left, right, options, context) => {
    if (typeof left !== 'string') {
        return false;
    }

    right = processRightValue(right, context);

    if (typeof right !== 'string') {
        throw new Error(MSG.OPERAND_NOT_STRING(ops.START_WITH));
    }

    return left.startsWith(right);
});

config.addValidatorToMap(OP_END_WITH, (left, right, options, context) => {
    if (typeof left !== 'string') {
        return false;
    }

    right = processRightValue(right, context);

    if (typeof right !== 'string') {
        throw new Error(MSG.OPERAND_NOT_STRING(ops.END_WITH));
    }

    return left.endsWith(right);
});

config.addValidatorToMap(OP_SAME_AS, (left, right, options, context) => {
    if (typeof left === 'object') {
        throw new Error(MSG.VALUE_NOT_PRIMITIVE(ops.OP_SAME_AS));
    }
    if (typeof right !== 'string') {
        throw new Error(MSG.OPERAND_NOT_STRING(ops.OP_SAME_AS));
    }

    return left === context.$$PARENT[right];
});

export default validate;

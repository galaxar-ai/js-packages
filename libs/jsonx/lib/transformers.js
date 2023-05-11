// JSON Expression Syntax (JES)
import _size from 'lodash/size';
import _reduce from 'lodash/reduce';
import _reverse from 'lodash/reverse';
import _keys from 'lodash/keys';
import _values from 'lodash/values';
import _pick from 'lodash/pick';
import _pickBy from 'lodash/pickBy';
import _nth from 'lodash/nth';
import _omit from 'lodash/omit';
import _omitBy from 'lodash/omitBy';
import _groupBy from 'lodash/groupBy';
import _sortBy from 'lodash/sortBy';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _mapValues from 'lodash/mapValues';
import _findIndex from 'lodash/findIndex';
import _findKey from 'lodash/findKey';
import _isEqual from 'lodash/isEqual';
import _each from 'lodash/each';

import { remap, isPlainObject, get as _get, template, filterNull } from '@genx/july';

import config, { getChildContext } from './config';
import ops from './transformerOperators';
import validators from './validateOperators';
import { test } from './validate';
import './validators';
import transform from './transform';

const MSG = config.messages;

const UNARY = true;
const BINARY = false;

//Query & aggregate operators (pure)
const OP_MATCH = [ops.MATCH, BINARY, '$has', '$match', '$all', '$validate', '$when'];
const OP_SIZE = [ops.SIZE, UNARY, '$size', '$length', '$count'];
const OP_SUM = [ops.SUM, UNARY, '$sum', '$total'];
const OP_GET_TYPE = [ops.GET_TYPE, UNARY, '$type'];
const OP_GET_BY_INDEX = [ops.GET_BY_INDEX, BINARY, '$at', '$getByIndex', '$nth']; // supports -1 as the last index, -2 the second last
const OP_GET_BY_KEY = [ops.GET_BY_KEY, BINARY, '$of', '$valueOf', '$getByKey']; // support key path
const OP_FIND = [ops.FIND, BINARY, '$indexOf', '$keyOf'];
const OP_IF = [ops.IF, BINARY, '$if'];
const OP_CAST_ARRAY = [ops.CAST_ARRAY, UNARY, '$castArray', '$makeArray'];

//Math operators (pure)
const OP_ADD = [ops.ADD, BINARY, '$add', '$plus', '$inc'];
const OP_SUB = [ops.SUB, BINARY, '$sub', '$subtract', '$minus', '$dec'];
const OP_MUL = [ops.MUL, BINARY, '$mul', '$multiply', '$times'];
const OP_DIV = [ops.DIV, BINARY, '$div', '$divide'];
const OP_MOD = [ops.MOD, BINARY, '$mod', '$remainder'];

//Collection operators (pure)
const OP_KEYS = [ops.KEYS, UNARY, '$keys'];
const OP_VALUES = [ops.VALUES, UNARY, '$values'];
const OP_ENTRIES = [ops.ENTRIES, UNARY, '$entries'];
const OP_OBJ_TO_ARRAY = [ops.OBJ_TO_ARRAY, UNARY, '$toArray', '$objectToArray'];
const OP_FILTER_NULL = [ops.FILTER_NULL, UNARY, '$filterNull', '$filterNullValues'];
const OP_PICK = [ops.PICK, BINARY, '$pick', '$pickBy', '$filterByKeys']; // filter by key
const OP_OMIT = [ops.OMIT, BINARY, '$omit', '$omitBy'];
const OP_SLICE = [ops.SLICE, BINARY, '$slice', '$limit'];
const OP_GROUP = [ops.GROUP, BINARY, '$group', '$groupBy'];
const OP_SORT = [ops.SORT, BINARY, '$sort', '$orderBy', '$sortBy'];
const OP_REVERSE = [ops.REVERSE, UNARY, '$reverse'];
const OP_JOIN = [ops.JOIN, BINARY, '$join', '$implode'];
const OP_MERGE = [ops.MERGE, BINARY, '$merge']; // merge a list of transform result over the value
const OP_FILTER = [ops.FILTER, BINARY, '$filter', '$select', '$filterByValue']; // filter by value
const OP_REMAP = [ops.REMAP, BINARY, '$remap', '$mapKeys']; // reverse-map, map a key to another name
const OP_TO_JSON = [ops.TO_JSON, UNARY, '$json', '$toJSON', '$stringify'];
const OP_TO_OBJ = [ops.TO_OBJ, UNARY, '$object', '$toObject', '$parseJSON'];

//Value updater (pure)
const OP_SET = [ops.SET, BINARY, '$set', '$=', '$value'];
const OP_ADD_ITEM = [ops.ADD_ITEM, BINARY, '$addItem', '$addFields'];
const OP_ASSIGN = [ops.ASSIGN, BINARY, '$assign', '$override', '$replace']; // will delete undefined entries
const OP_APPLY = [ops.APPLY, BINARY, '$apply', '$eval']; // to be used in collection

//String manipulate
const OP_SPLIT = [ops.SPLIT, BINARY, '$split', '$explode'];
const OP_INTERPOLATE = [ops.INTERPOLATE, BINARY, '$interpolate', '$template'];

// [ <op name>, <unary> ]
//embeded validators in processing pipeline
const matchOptions = { throwError: false, abortEarly: true, asPredicate: true };

config.addTransformerToMap(OP_MATCH, (left, right, context) =>
    test(left, validators.MATCH, right, matchOptions, context)
);

config.addTransformerToMap(OP_SIZE, (left) => _size(left));

config.addTransformerToMap(OP_SUM, (left) =>
    _reduce(
        left,
        (sum, item) => {
            sum += item;
            return sum;
        },
        0
    )
);

config.addTransformerToMap(OP_GET_TYPE, (left) =>
    Array.isArray(left) ? 'array' : Number.isInteger(left) ? 'integer' : typeof left
);

config.addTransformerToMap(OP_GET_BY_INDEX, (left, right) => _nth(left, right));
config.addTransformerToMap(OP_GET_BY_KEY, (left, right) => _get(left, right));

config.addTransformerToMap(OP_FIND, (left, right, context) => {
    const targetValue = transform(null, right, context);

    const predicate = (value) => _isEqual(value, targetValue);
    return Array.isArray(left) ? _findIndex(left, predicate) : _findKey(left, predicate);
});

config.addTransformerToMap(OP_IF, (left, right, context) => {
    if (!Array.isArray(right)) {
        throw new Error(MSG.OPERAND_NOT_ARRAY(ops.IF));
    }

    if (right.length < 2 || right.length > 3) {
        throw new Error(MSG.OPERAND_NOT_TUPLE_2_OR_3(ops.IF));
    }

    const condition = transform(left, right[0], context);

    if (condition) {
        return transform(left, right[1], context);
    } else if (right.length > 2) {
        return transform(left, right[2], context);
    }

    return left;
});

config.addTransformerToMap(OP_CAST_ARRAY, (left) => (left == null ? null : Array.isArray(left) ? left : [left]));

config.addTransformerToMap(OP_ADD, (left, right) => left + right);
config.addTransformerToMap(OP_SUB, (left, right) => left - right);
config.addTransformerToMap(OP_MUL, (left, right) => left * right);
config.addTransformerToMap(OP_DIV, (left, right) => left / right);
config.addTransformerToMap(OP_MOD, (left, right) => left % right);

config.addTransformerToMap(OP_KEYS, (left) => _keys(left));
config.addTransformerToMap(OP_VALUES, (left) => _values(left));
config.addTransformerToMap(OP_ENTRIES, (left) => _map(left, (value, key) => [key, value]));
config.addTransformerToMap(OP_OBJ_TO_ARRAY, (left) => _map(left, (v, k) => ({ k, v })));
config.addTransformerToMap(OP_FILTER_NULL, (left) => filterNull(left));

config.addTransformerToMap(OP_PICK, (left, right, context) => {
    if (left == null) {
        return null;
    }

    if (typeof right !== 'object') {
        right = [right];
    }

    if (Array.isArray(right)) {
        return _pick(left, right);
    }

    return _pickBy(left, (item, key) =>
        test(key, validators.MATCH, right, matchOptions, getChildContext(context, left, key, item))
    );
});

config.addTransformerToMap(OP_OMIT, (left, right, context) => {
    if (left == null) {
        return null;
    }

    if (typeof right !== 'object') {
        right = [right];
    }

    if (Array.isArray(right)) {
        return _omit(left, right);
    }

    return _omitBy(left, (item, key) =>
        test(key, validators.MATCH, right, matchOptions, getChildContext(context, left, key, item))
    );
});

config.addTransformerToMap(OP_SLICE, (left, right) => {
    if (left == null) {
        return null;
    }

    if (!Array.isArray(left)) {
        return new Error(MSG.VALUE_NOT_ARRAY(ops.SLICE));
    }

    if (Number.isInteger(right)) {
        return left.slice(right);
    }

    if (Array.isArray(right)) {
        if (right.length === 0 || right.length > 2) {
            return new Error(MSG.INVALID_OP_EXPR(ops.SLICE, right, ['integer', '[integer]']));
        }

        return left.slice(...right);
    }

    return new Error(MSG.INVALID_OP_EXPR(ops.SLICE, right));
});

config.addTransformerToMap(OP_GROUP, (left, right) => _groupBy(left, right));
config.addTransformerToMap(OP_SORT, (left, right) => _sortBy(left, right));
config.addTransformerToMap(OP_REVERSE, (left) => _reverse(left));

config.addTransformerToMap(OP_JOIN, (left, right) => {
    if (left == null) {
        return null;
    }
    if (!Array.isArray(left)) {
        throw new Error(MSG.VALUE_NOT_ARRAY(ops.JOIN));
    }

    return left.join(right.toString());
});

const objectMerger = (left, context) => [(result, expr) => Object.assign(result, transform(left, expr, context)), {}];

const arrayMerger = (left, context) => [(result, expr) => [...result, ...transform(left, expr, context)], []];

config.addTransformerToMap(OP_MERGE, (left, right, context) => {
    if (!Array.isArray(right)) {
        throw new Error(MSG.OPERAND_NOT_ARRAY(ops.MERGE));
    }

    return right.reduce(...(Array.isArray(left) ? arrayMerger(left, context) : objectMerger(left, context)));
});

config.addTransformerToMap(OP_FILTER, (left, right, context) => {
    if (left == null) {
        return null;
    }

    if (typeof left !== 'object') {
        throw new Error(MSG.VALUE_NOT_COLLECTION(ops.FILTER));
    }

    return _filter(left, (value, key) =>
        test(value, validators.MATCH, right, matchOptions, {
            path: MSG.makePath(key, context.path),
        })
    );
});
config.addTransformerToMap(OP_REMAP, (left, right) => {
    if (left == null) {
        return null;
    }

    if (typeof left !== 'object') {
        throw new Error(MSG.VALUE_NOT_COLLECTION(ops.REMAP));
    }

    if (Array.isArray(right)) {
        if (right.length !== 2) {
            throw new Error(MSG.OPERAND_NOT_TUPLE(ops.REMAP));
        }

        if (!isPlainObject(right[0]) || (right[1] != null && typeof right[1] !== 'boolean')) {
            throw new Error(MSG.INVALID_OP_EXPR(ops.REMAP, right, ['object', 'boolean']));
        }

        return remap(left, right[0], right[1]);
    }

    if (!isPlainObject(right)) {
        throw new Error(MSG.OPERAND_NOT_OBJECT(ops.REMAP));
    }

    return remap(left, right);
});

config.addTransformerToMap(OP_TO_JSON, (left) => (left == null ? left : JSON.stringify(left)));
config.addTransformerToMap(OP_TO_OBJ, (left) => (left == null ? left : JSON.parse(left)));

config.addTransformerToMap(OP_SET, (left, right, context) => transform(undefined, right, context, true));
config.addTransformerToMap(OP_ADD_ITEM, (left, right, context) => {
    if (typeof left !== 'object') {
        throw new Error(MSG.VALUE_NOT_COLLECTION(ops.ADD_ITEM));
    }

    if (Array.isArray(left)) {
        return left.concat(transform(left, right, context));
    }

    if (!Array.isArray(right) || right.length !== 2) {
        throw new Error(MSG.OPERAND_NOT_TUPLE(ops.ADD_ITEM));
    }

    if (typeof right[0] !== 'string') {
        throw new Error(MSG.INVALID_OP_EXPR(ops.ADD_ITEM, right, ['string', 'any']));
    }

    return {
        ...left,
        [right[0]]: transform(left, right[1], context),
    };
});
config.addTransformerToMap(OP_ASSIGN, (left, right, context) => {
    if (!isPlainObject(left)) {
        if (left == null) {
            left = {};
        } else {
            throw new Error(MSG.VALUE_NOT_OBJECT(ops.ASSIGN));
        }
    }

    if (!isPlainObject(right)) {
        throw new Error(MSG.OPERAND_NOT_OBJECT(ops.ASSIGN));
    }

    const rightValue = _mapValues(right, (expr, key) =>
        transform(
            left[key],
            typeof expr === 'string' && expr.startsWith('$') ? expr : typeof expr === 'object' ? expr : { $set: expr },
            getChildContext(context, left, key, left[key])
        )
    );

    const toRemove = [];
    _each(rightValue, (value, key) => {
        if (value === undefined) {
            toRemove.push(key);
        }   
    });
      
    const merged = { ...left, ...rightValue };

    return toRemove.length > 0 ? _omit(merged, toRemove) : merged;
});

config.addTransformerToMap(OP_APPLY, transform);

config.addTransformerToMap(OP_SPLIT, (left, right) => {
    if (typeof left !== 'string') {
        throw new Error(MSG.VALUE_NOT_STRING(ops.SPLIT));
    }

    if (Array.isArray(right)) {
        if (right.length !== 2) {
            throw new Error(MSG.OPERAND_NOT_TUPLE(ops.SPLIT));
        }

        const [separator, limit] = right;

        if (typeof separator !== 'string' || (limit != null && typeof limit !== 'number')) {
            throw new Error(MSG.INVALID_OP_EXPR(ops.SPLIT, right, ['string', 'number']));
        }

        return left.split(separator, limit);
    } else if (typeof right !== 'string') {
        throw new Error(MSG.OPERAND_NOT_STRING(ops.SPLIT));
    }

    return left.split(right);
});

config.addTransformerToMap(OP_INTERPOLATE, (left, right) => {
    if (typeof left !== 'string') {
        throw new Error(MSG.VALUE_NOT_STRING(ops.INTERPOLATE));
    }

    if (right != null && typeof right !== 'object') {
        throw new Error(MSG.OPERAND_NOT_OBJECT(ops.INTERPOLATE));
    }

    return template(left, right);
});

export default transform;

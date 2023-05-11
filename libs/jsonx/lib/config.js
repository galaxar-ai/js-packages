const validatorHandlers = {};
const mapOfValidators = {};

const transformerHandlers = {};
const mapOfTransformers = {};

const formatName = (name, left, context, custom) => {
    const fullName = name == null ? context.path : makePath(name, context?.path);
    return fullName == null
        ? messages.nameOfValue(custom)
        : context?.mapOfNames
        ? context.mapOfNames[fullName]
        : fullName;
};

const formatKey = (key, hasPrefix) => (Number.isInteger(key) ? `[${key}]` : hasPrefix ? '.' + key : key);
const makePath = (key, prefix) => (prefix != null ? `${prefix}${formatKey(key, true)}` : formatKey(key, false));
const formatPath = (prefix) => (prefix ? '[' + prefix + ']' : '<ROOT>');

export const getChildContext = (context, currentValue, childKey, childValue) => ({
    ...context,
    path: makePath(childKey, context.path),
    $$PARENT: currentValue,
    $$CURRENT: childValue,
    $$KEY: childKey,
});

export const messages = {
    formatName,
    formatKey,
    makePath,

    //Exception messages
    SYNTAX_OP_NOT_ALONE: 'Transformer operator can only be used alone in one pipeline stage.',
    SYNTAX_INVALID_EXPR: (expr) => `Invalid expression syntax: ${JSON.stringify(expr)}`, // complext expr, not split out operator yet
    SYNTAX_INVALID_OP: (op, prefix) => `Invalid operator "${op}" at ${formatPath(prefix)}.`,
    SYNTAX_NUMBER_AS_EXPR: 'Number value cannot be used as a transformer expression.',

    INVALID_TRANSFORMER_OP: (op) => `Invalid transformer operator "${op}".`,
    UNSUPPORTED_VALIDATION_OP: (op, prefix) => `Unsupported validation operator "${op}" at ${formatPath(prefix)}.`,
    INVALID_COLLECTION_OP: (op) => `Invalid collection operator "${op}".`,

    INVALID_TRANSFORMER_HANDLER: (tag) => `Handler for transformer "${tag}" not found.`,
    INVALID_TEST_HANLDER: (tag) => `Handler for validator "${tag}" not found.`,

    INVALID_OP_EXPR: (op, right, expected) => `Invalid "${op}" expression: ${JSON.stringify(right)}` + (expected ? `, expected: ${JSON.stringify(expected)}.` : '.'),
    INVALID_COLLECTION_OP_EXPR: (collectionOp, op, right) =>
        `Invalid "${op}" expression for collection "${collectionOp}" traversing: ${JSON.stringify(right)}.`,
    UNSUPPORTED_TYPE: (type) => `Supported type "${type}".`,

    OPERAND_NOT_TUPLE: (op) =>
        `The right operand of a collection operator ${op ? '"' + op + '" ' : ''}must be a two-tuple.`,
    OPERAND_NOT_TUPLE_2_OR_3: (op) => `The right operand of a "${op}" operator must be either a 2-tuple or a 3-tuple.`,
    OPERAND_NOT_ARRAY: (op) => `The right operand of a "${op}" operator must be an array.`,
    OPERAND_NOT_BOOL: (op) => `The right operand of a "${op}" operator must be a boolean value.`,
    OPERAND_NOT_STRING: (op) => `The right operand of a "${op}" operator must be a string.`,
    OPERAND_NOT_OBJECT: (op) => `The right operand of a "${op}" operator must be an object.`,

    VALUE_NOT_ARRAY: (op) => `The value to take a "${op}" operator must be an array.`,
    VALUE_NOT_COLLECTION: (op) => `The value to take a "${op}" operator must be either an object or an array.`,
    VALUE_NOT_PRIMITIVE: (op) => `The value to take a "${op}" operator must be a primitive value, e.g. string, number.`,
    VALUE_NOT_STRING: (op) => `The value to take a "${op}" operator must be a string.`,
    VALUE_NOT_OBJECT: (op) => `The value to take a "${op}" operator must be an object.`,

    REQUIRE_RIGHT_OPERAND: (op) => `Binary operator "${op}" requires a right operand.`,
    RIGHT_OPERAND_NOT_EMPTY: (op) => `Unary operator "${op}" does not require a right operand.`,

    MULTI_ERRORS: (numErrors) => `${numErrors} errors occurred.`,
};

//JSON Expression Syntax Runtime Configuration
const config = {
    dump: () => {
        console.log(Object.keys(validatorHandlers));
    },
    // eslint-disable-next-line no-undef
    dev: process?.env.NODE_ENV === 'development',
    messages,
    addValidatorToMap: (tokens, handler) => {
        const [tag, ...alias] = tokens;

        alias.forEach((op) => {
            if (op in mapOfValidators) {
                throw new Error(`Duplicate validator alias "${op}" for operator "${tag}".`);
            }
            mapOfValidators[op] = tag;
        });

        if (tag in validatorHandlers) {
            throw new Error(`Duplicate operator name "${tag}".`);
        }

        validatorHandlers[tag] = handler;
    },
    addTransformerToMap: (tokens, handler) => {
        const [tag, isUnary, ...alias] = tokens;

        if (typeof isUnary !== 'boolean') {
            throw new Error('The second param should be a boolean value.');
        }

        alias.forEach((op) => {
            if (op in mapOfTransformers) {
                throw new Error(`Duplicate transformer alias: "${op}" for operator "${tag}".`);
            }
            mapOfTransformers[op] = [tag, isUnary];
        });

        if (tag in transformerHandlers) {
            throw new Error(`Duplicate operator name: "${tag}".`);
        }

        transformerHandlers[tag] = handler;
    },
    overrideTransformer: (tag, handler) => {
        transformerHandlers[tag] = handler;
    },
    overrideValidator: (tag, handler) => {
        validatorHandlers[tag] = handler;
    },

    getValidatorTag: (op) => mapOfValidators[op],
    getValidator: (tag) => validatorHandlers[tag],

    getTransformerTagAndType: (op) => mapOfTransformers[op],
    getTransformer: (tag) => transformerHandlers[tag],
    loadMessages: (moreMessages) => Object.assign(config.messages, moreMessages),
};

export default config;

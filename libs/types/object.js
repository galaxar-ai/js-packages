import _each from 'lodash/each';
import { ValidationError } from './errors';
import { Types, safeJsonStringify, beginSanitize } from './types';
import { makePath } from '@galaxar/utils/objectPathUtils';
import isPlainObject from '@galaxar/utils/isPlainObject';

const jsonStarter = new Set(['"', '[', '{']);
const jsonEnding = {
    '"': '"',
    '[': ']',
    '{': '}',
};

export default {
    name: 'object',
    alias: ['json'],
    defaultValue: {},
    validate: value =>isPlainObject(value),
    sanitize: (value, meta, i18n, path) => {
        const [ isDone, sanitized ] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        const raw = value;
        const type = typeof value;

        if (type === 'string') {
            if (
                value.length > 1 &&
                jsonStarter.has(value[0]) &&
                jsonEnding[value[0]] === value[value.length - 1]
            ) {                                
                value = JSON.parse(value);
            }
        }

        if (meta.schema) {
            if (typeof value !== 'object') {
                throw new ValidationError('Invalid object value.', {
                    value: raw,
                    meta,
                    i18n,
                    path,
                });
            }

            const schema = typeof meta.schema === 'function' ? meta.schema() : meta.schema;
            const newValue = {};
            _each(schema, (validationObject, fieldName) => {
                const fieldValue = value[fieldName];
                newValue[fieldName] = Types.sanitize(fieldValue, validationObject, i18n, makePath(path, fieldName));                
            });

            if (meta.keepUnsanitized) {
                return { ...value, ...newValue };
            }

            return newValue;
        }

        return value;
    },

    serialize: (value) => {
        if (value == null) return null;
        return safeJsonStringify(value);
    }
};

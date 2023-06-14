import _each from 'lodash/each';
import { ValidationError } from './errors';
import { makePath } from '@galaxar/utils/objectPathUtils';
import isPlainObject from '@galaxar/utils/isPlainObject';
import batchAsync_ from '@galaxar/utils/batchAsync_';

const jsonStarter = new Set(['"', '[', '{']);
const jsonEnding = {
    '"': '"',
    '[': ']',
    '{': '}',
};

class T_OBJECT {
    name = 'object';
    alias = ['json'];
    primitive = true;
    defaultValue = {};

    constructor(system) {
        this.system = system;
    }

    validate(value) {
        return isPlainObject(value);
    }

    _sanitize(value, meta, opts) {
        const type = typeof value;

        if (type === 'string') {
            if (value.length > 1 && jsonStarter.has(value[0]) && jsonEnding[value[0]] === value[value.length - 1]) {
                value = JSON.parse(value);
            }
        }

        if (meta.schema) {
            if (typeof value !== 'object') {
                throw new ValidationError('Invalid object value.', {
                    value,
                    meta,
                    ...opts
                });
            }

            const schema = typeof meta.schema === 'function' ? meta.schema() : meta.schema;
            const newValue = {};
            _each(schema, (validationObject, fieldName) => {
                const fieldValue = value[fieldName];

                const _fieldValue = this.system.sanitize(fieldValue, validationObject, opts.i18n, makePath(opts.path, fieldName));
                if (_fieldValue != null || fieldName in value) {
                    newValue[fieldName] = _fieldValue;
                }
            });

            if (meta.keepUnsanitized) {
                return { ...value, ...newValue };
            }

            return newValue;
        }

        return value;
    }

    async _sanitizeAsync(value, meta, opts) {
        const type = typeof value;

        if (type === 'string') {
            if (value.length > 1 && jsonStarter.has(value[0]) && jsonEnding[value[0]] === value[value.length - 1]) {
                value = JSON.parse(value);
            }
        }

        if (meta.schema) {
            if (typeof value !== 'object') {
                throw new ValidationError('Invalid object value.', {
                    value,
                    meta,
                    ...opts
                });
            }

            const schema = typeof meta.schema === 'function' ? meta.schema() : meta.schema;
            const newValue = {};
            await batchAsync_(schema, async (validationObject, fieldName) => {
                const fieldValue = value[fieldName];

                const _fieldValue = await this.system.sanitize_(fieldValue, validationObject, opts.i18n, makePath(opts.path, fieldName));
                if (_fieldValue != null || fieldName in value) {
                    newValue[fieldName] = _fieldValue;
                }
            });

            if (meta.keepUnsanitized) {
                return { ...value, ...newValue };
            }

            return newValue;
        }

        return value;
    }

    serialize(value) {
        if (value == null) return null;
        return this.system.safeJsonStringify(value);
    }
};

export default T_OBJECT;

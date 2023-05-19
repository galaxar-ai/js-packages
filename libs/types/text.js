import { identity } from './functions';
import { ValidationError } from './errors';
import { beginSanitize } from './types';

export default {
    name: 'text',
    alias: ['string'],
    defaultValue: '',
    validate: (value) => typeof value === 'string',
    sanitize: (value, meta, i18n, path) => {
        const isString = typeof value === 'string';

        if (isString && meta.trim) {
            value = value.trim();
        }

        if (value === '' && meta.nonEmpty) {
            value = null;
        }

        const [isDone, sanitized] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        if (!isString) {
            throw new ValidationError('Invalid text value.', {
                value,
                meta,
                i18n,
                path,
            });
        }

        return value;
    },

    serialize: identity,
};

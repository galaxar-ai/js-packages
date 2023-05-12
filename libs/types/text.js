import { identity } from './functions';
import { ValidationError } from './errors';
import { beginSanitize } from './types';

export default {
    name: 'text',
    alias: ['string'],
    defaultValue: '',
    validate: value => typeof value === 'string',
    sanitize: (value, meta, i18n, path) => {
        if (value === '' && meta.emptyAsNull) {
            value = null;
        }

        const [ isDone, sanitized ] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;        

        if (typeof value !== 'string') {
            throw new ValidationError('Invalid text value.', {
                value,
                meta,
                i18n,
                path
            });
        }

        return value;
    },

    serialize: identity
};

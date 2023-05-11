import { identity } from './functions';
import { ValidationError } from './errors';

export default {
    name: 'text',
    alias: ['string'],
    defaultValue: '',

    sanitize: (value, meta, i18n, path) => {
        if (value == null) return null;
        if (meta.rawValue) return value;

        if (value === '' && meta.emptyAsNull) {
            return null;
        }

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

import { ValidationError } from './errors';
import { Plugins } from './types';

export default {
    name: 'bigint',
    alias: ['biginteger'],
    defaultValue: 0n,
    validate: value => typeof value === 'bigint',
    sanitize: (value, meta, i18n, path) => {
        if (value == null) return null;
        if (meta.rawValue) return value;

        const raw = value;
        try {
            value = BigInt(value);
        } catch (e) {
            throw new ValidationError('Invalid bigint value.', {
                value: raw,
                meta,
                i18n,
                path
            }, e);
        }

        return value;
    },

    serialize: (value) => value == null ? null : (Plugins['bigintWriter'] ? Plugins['bigintWriter'](value) : value.toString()),
};

import toBoolean from '@galaxar/utils/toBoolean';
import { identity } from './functions';

export default {
    name: 'boolean',
    alias: ['bool'],
    defaultValue: false,
    validate: value => typeof value === 'boolean',
    sanitize: (value, meta, i18n) => {
        if (value == null) return null;
        if (meta.rawValue) return value;

        return toBoolean(value);
    },

    serialize: identity
};

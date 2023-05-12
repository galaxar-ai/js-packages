import toBoolean from '@galaxar/utils/toBoolean';
import { identity } from './functions';
import { beginSanitize } from './types';

export default {
    name: 'boolean',
    alias: ['bool'],
    defaultValue: false,
    validate: value => typeof value === 'boolean',
    sanitize: (value, meta, i18n, path) => {
        const [ isDone, sanitized ] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        return toBoolean(value);
    },

    serialize: identity
};

import { everTrue } from './functions';
import { beginSanitize } from './types';

const T_ANY = {
    name: 'any',
    alias: ['*'],
    defaultValue: null,
    validate: everTrue,
    sanitize: (value, meta, i18n, path) => {
        const [isDone, sanitized] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        return value;
    },
    serialize: (value) => (typeof value === 'object' ? JSON.stringify(value) : value),
};

export default T_ANY;

import { ValidationError } from './errors';
import toInteger from "@galaxar/utils/toInteger";
import { identity } from "./functions";
import { beginSanitize } from './types';

export default {
    name: 'integer',
    alias: ['int'],
    defaultValue: 0,
    validate: value => typeof value === 'number' && Number.isInteger(value),
    sanitize: (value, meta, i18n, path) => {
        const [ isDone, sanitized ] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        const raw = value;
        value = toInteger(value);

        if (isNaN(value)) {
            throw new ValidationError('Invalid integer value.', {
                value: raw,
                meta,
                i18n,
                path
            });
        }

        return value;
    },

    serialize: identity,
};

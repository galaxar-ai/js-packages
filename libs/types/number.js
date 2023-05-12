import { ValidationError } from './errors';
import toFloat from '@galaxar/utils/toFloat';
import { identity } from "./functions";
import { beginSanitize } from './types';

export default {
    name: 'number',
    alias: ['float', 'double'],
    defaultValue: 0,
    validate: value => typeof value === 'number',
    sanitize: (value, meta, i18n, path) => {
        const [ isDone, sanitized ] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        const raw = value;
        value = toFloat(value);

        if (isNaN(value)) {
            throw new ValidationError('Invalid number value.', {
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

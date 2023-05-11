import { ValidationError } from './errors';
import toFloat from '@galaxar/utils/toFloat';
import { identity } from "./functions";

export default {
    name: 'number',
    alias: ['float', 'double'],
    defaultValue: 0,

    sanitize: (value, meta, i18n, path) => {
        if (value == null) return null;
        if (meta.rawValue) return value;

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

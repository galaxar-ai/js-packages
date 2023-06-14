import { identity } from './functions';
import { ValidationError } from './errors';

class T_TEXT {
    name = 'text';
    alias = ['string'];
    primitive = true;
    scalar = true;
    defaultValue = '';

    constructor(system) {
        this.system = system;
    }

    validate(value) {
        return typeof value === 'string';
    }

    _sanitize(value, meta, opts) {
        const type = typeof value;
        const isString = type === 'string';

        if (isString) {
            if (meta.trim) {
                value = value.trim();
            }

            if (value === '' && meta.nonEmpty) {
                value = null;
                if (!meta.optional) {
                    throw new ValidationError('Value ' + (opts.path ? `of "${opts.path}" ` : '') + 'is required.', {
                        value,
                        meta,
                        ...opts,
                    });
                }
            }
        } else {
            if (type === 'bigint' || type === 'number') {
                return value.toString();
            }

            throw new ValidationError('Value ' + (opts.path ? `of "${opts.path}" ` : '') + 'is required.', {
                value,
                meta,
                ...opts,
            });
        }

        return value;
    }

    serialize = identity;
}

export default T_TEXT;

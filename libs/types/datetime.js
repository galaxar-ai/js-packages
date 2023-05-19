import { Plugins, beginSanitize } from './types';
import { ValidationError, ApplicationError } from './errors';

export default {
    name: 'datetime',
    alias: ['date', 'time', 'timestamp'],
    defaultValue: new Date(0),
    validate: (value) => value instanceof Date,

    /**
     * Transform a value into a JavaScript Date object.
     * @param {*} value
     * @param {*} meta
     * @param {*} i18n
     * @param {string} [path]
     * @returns {Date|null}
     */
    sanitize: (value, meta, i18n, path) => {
        const [isDone, sanitized] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        const raw = value;

        if (value instanceof Date) {
            return value;
        } else {
            const type = typeof value;

            if (type === 'string') {
                if (meta.format) {
                    const parser = Plugins['datetimeParser'];
                    if (!parser) {
                        throw new ApplicationError('Missing datetime parser plugin.');
                    }
                    value = parser(value, { format: meta.format, timezone: i18n?.timezone });
                } else {
                    value = new Date(value);
                }
            } else if (type === 'number') {
                value = new Date(value);
            } else if (value.toJSDate) {
                value = value.toJSDate();
            }

            if (isNaN(value)) {
                throw new ValidationError('Invalid datetime value.', {
                    value: raw,
                    meta,
                    i18n,
                    path,
                });
            }
        }

        return value;
    },

    serialize: (value) => {
        return value?.toISOString();
    },
};

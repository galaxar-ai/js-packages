import _castArray from 'lodash/castArray';
import { messages } from './config';

export default class ValidationError extends Error {
    constructor(errorOrErrors, value, field) {
        const errors = [];
        let inner = [];

        _castArray(errorOrErrors).forEach((err) => {
            if (err.name === 'ValidationError') {
                errors.push(...err.errors);
                inner = [...inner, ...(err.inner.length > 0 ? err.inner : [err])];
            } else {
                errors.push(err);
                if (err.inner && Array.isArray(err.inner)) {
                    inner = [...inner, ...err.inner];
                }
            }
        });

        super(errors.length > 1 ? messages.MULTI_ERRORS(errors.length) : errors[0]);

        this.name = 'ValidationError';
        this.value = value;
        this.path = field;
        this.errors = errors;
        this.inner = inner;
    }
}

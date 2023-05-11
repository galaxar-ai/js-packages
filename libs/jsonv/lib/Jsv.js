import config from './config';
import validate from './validators';

/**
 * JSON Validation Syntax 
 * @class
 */
class Jsv {
    static config = config;
    static match = (value, jsv, options, jsonx) => {
        const reason = validate(value, jsv, {
            throwError: false,
            abortEarly: true,
            plainError: true,
            ...options
        }, jsonx && { jsonx });
        if (reason === true) {
            return [true];
        }

        return [false, reason];
    };

    /**
     * @param {object} value
     */
    constructor(value) {
        this.value = value;
    }

    /**
     * Match the value with expected conditions in JSON expression
     * @param {object} expected - JSON match expression
     * @throws ValidationError
     * @returns {Jsv}
     */
    match(expected) {
        validate(this.value, expected);
        return this;
    }
}

export default Jsv;

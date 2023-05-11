import config from './config';
import validate from './validators';
import transform from './transformers';

/**
 * JSON Expression Syntax Object
 * @class
 */
class JES {
    static config = config;
    static match = (actual, expectedJES) => {
        const reason = validate(actual, expectedJES, {
            throwError: false,
            abortEarly: true,
            plainError: true,
        });
        if (reason === true) {
            return [true];
        }

        return [false, reason];
    };
    static evaluate = transform;

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
     * @returns {JES}
     */
    match(expected) {
        validate(this.value, expected);
        return this;
    }

    /**
     * Evaluate a JSON expression against the value
     * @param {object} - JSON operation expression
     */
    evaluate(expr) {
        return transform(this.value, expr);
    }

    /**
     * Evaluate a JSON expression against the value and update the value
     * @param {object} - JSON operation expression
     * @returns {JES}
     */
    update(expr) {
        this.value = transform(this.value, expr);
        return this;
    }
}

export default JES;

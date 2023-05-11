import { ExposableError, ApplicationError } from './AppErrors';
import { StatusCodes as HttpCode } from 'http-status-codes';

/**
 * Data errors.
 * @module DataErrors
 */

/**
 * Validation error.
 * @class
 */
export class ValidationError extends ExposableError {
    constructor(message, info, inner) {
        super(message, info, HttpCode.BAD_REQUEST, 'E_INVALID_DATA');

        this.inner = inner;
    }
};

/**
 * Referenced entity not found.
 * @class
 */
export class ReferencedNotExist extends ExposableError {
    constructor(message, info) {
        super(message, info, HttpCode.BAD_REQUEST, 'E_REFERENCED_NOT_EXIST');
    }
};

/**
 * Duplicate error.
 * @class
 */
export class DuplicateError extends ExposableError {
    constructor(message, info) {
        super(message, info, HttpCode.BAD_REQUEST, 'E_DUPLICATE');
    }
};

/**
 * Unexpected data/state error.
 * @class
 */
export class UnexpectedState extends ApplicationError {
    constructor(message, info) {
        super(message, info, 'E_UNEXPECTED');
    }
};

/**
 * Database operation error.
 * @class
 */
export class DatabaseError extends ApplicationError {
    constructor(message, info) {
        super(message, info, 'E_DATABASE');
    }
};
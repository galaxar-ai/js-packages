"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ValidationError: function() {
        return ValidationError;
    },
    ReferencedNotExist: function() {
        return ReferencedNotExist;
    },
    DuplicateError: function() {
        return DuplicateError;
    },
    UnexpectedState: function() {
        return UnexpectedState;
    },
    DatabaseError: function() {
        return DatabaseError;
    }
});
const _AppErrors = require("./AppErrors");
const _HttpCode = /*#__PURE__*/ _interop_require_default(require("./HttpCode"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class ValidationError extends _AppErrors.ExposableError {
    static formatError(error) {
        let fullMessage = error.message;
        if (error.info.error) {
            fullMessage += ' ' + error.info.error;
        }
        if (error.info.errors) {
            fullMessage += '\nAll of these alternative validations failed:\n' + error.info.errors.map((_error, i)=>`Option ${i + 1} field "${_error.info.path}": ${_error.message}`).join('\n');
        }
        return fullMessage;
    }
    static extractFromError(error) {
        const _error = {
            message: error.message,
            info: error.info
        };
        if (error.inner) {
            _error.inner = ValidationError.extractFromError(error.inner);
        }
        return _error;
    }
    constructor(message, info, inner){
        super(message, info, _HttpCode.default.BAD_REQUEST, 'E_INVALID_DATA');
        this.inner = inner;
    }
}
class ReferencedNotExist extends _AppErrors.ExposableError {
    constructor(message, info){
        super(message, info, _HttpCode.default.BAD_REQUEST, 'E_REFERENCED_NOT_EXIST');
    }
}
class DuplicateError extends _AppErrors.ExposableError {
    constructor(message, info){
        super(message, info, _HttpCode.default.BAD_REQUEST, 'E_DUPLICATE');
    }
}
class UnexpectedState extends _AppErrors.ApplicationError {
    constructor(message, info){
        super(message, info, 'E_UNEXPECTED');
    }
}
class DatabaseError extends _AppErrors.ApplicationError {
    constructor(message, info){
        super(message, info, 'E_DATABASE');
    }
}

//# sourceMappingURL=DataErrors.js.map
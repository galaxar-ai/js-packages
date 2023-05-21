"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _castArray = /*#__PURE__*/ _interop_require_default(require("lodash/castArray"));
const _config = require("./config");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class JsvError extends Error {
    constructor(errorOrErrors, value, field){
        const errors = [];
        let inner = [];
        (0, _castArray.default)(errorOrErrors).forEach((err)=>{
            if (err.name === 'JsvError') {
                errors.push(...err.errors);
                inner = [
                    ...inner,
                    ...err.inner.length > 0 ? err.inner : [
                        err
                    ]
                ];
            } else {
                errors.push(err);
                if (err.inner && Array.isArray(err.inner)) {
                    inner = [
                        ...inner,
                        ...err.inner
                    ];
                }
            }
        });
        super(errors.length > 1 ? _config.messages.MULTI_ERRORS(errors.length) : errors[0]);
        this.name = 'JsvError';
        this.value = value;
        this.path = field;
        this.errors = errors;
        this.inner = inner;
    }
}
const _default = JsvError;

//# sourceMappingURL=JvsError.js.map
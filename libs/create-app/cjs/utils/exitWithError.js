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
const exitWithError = (app, message, code = -1)=>{
    app.log('error', message);
    process.exit(code);
};
const _default = exitWithError;

//# sourceMappingURL=exitWithError.js.map
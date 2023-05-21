/**
 * Middleware to check user logged in status based on passport
 * @module Middleware_PassportCheck
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _types = require("@galaxar/types");
/**
 * Initialize ensureLoggedIn middleware
 * @param {object} options
 * @property {string} [options.loginUrl] - If given, will redirect to loginUrl if not loggedIn
 * @property {boolean} [options.successReturnToOrRedirect] - If given, will redirect to loginUrl if not loggedIn
 * @param {Routable} app
 */ const passportCheck = (options, app)=>{
    return async (ctx, next)=>{
        if (ctx.isAuthenticated()) {
            return next();
        }
        if (options.successReturnToOrRedirect && ctx.session) {
            ctx.session.returnTo = ctx.originalUrl || ctx.url;
        }
        if (!options.loginUrl) {
            ctx.throw(_types.HttpCode.UNAUTHORIZED, 'authentication required');
        }
        return ctx.redirect(options.loginUrl);
    };
};
const _default = passportCheck;

//# sourceMappingURL=passportCheck.js.map
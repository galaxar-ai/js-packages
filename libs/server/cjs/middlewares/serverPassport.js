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
const _types = require("@galaxar/types");
/**
 * Passport initialization middleware, use the passport service exposed by other app to server.
 * @module Middleware_ServerPassport
 */ /**
 * Create a passport authentication middleware.
 * @param {object} opt - Passport options
 * @property {string} opt.strategy - Passport strategy
 * @property {object} [opt.options] - Passport strategy options
 * @property {object} [opt.customHandler] - Flag to use passport strategy customHandler
 * @param {Routable} app
 * @returns {KoaActionFunction}
 */ const serverPassport = (opt, app)=>{
    let passportService = app.getService('passport');
    if (!passportService) {
        throw new _types.InvalidConfiguration('Passport feature is not enabled.', app, 'passport');
    }
    return passportService.middlewares;
};
const _default = serverPassport;

//# sourceMappingURL=serverPassport.js.map
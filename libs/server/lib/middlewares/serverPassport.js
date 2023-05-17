import { InvalidConfiguration } from "@galaxar/types";

/**
 * Passport initialization middleware, use the passport service exposed by other app to server.
 * @module Middleware_ServerPassport
 */

/**
 * Create a passport authentication middleware.
 * @param {object} opt - Passport options
 * @property {string} opt.strategy - Passport strategy
 * @property {object} [opt.options] - Passport strategy options
 * @property {object} [opt.customHandler] - Flag to use passport strategy customHandler 
 * @param {Routable} app
 * @returns {KoaActionFunction}
 */
const serverPassport = (opt, app) => {
    
    let passportService = app.getService('passport');

    if (!passportService) {
        throw new InvalidConfiguration(
            'Passport feature is not enabled.',
            app,
            'passport'
        );
    }

    return passportService.middlewares;
};

export default serverPassport;
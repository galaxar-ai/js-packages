import { InvalidConfiguration } from '@galaxar/types';

/**
 * Passport initialization middleware, required to initialize Passport service.
 * @module Middleware_PassportAuth
 */

/**
 * Create a passport authentication middleware.
 * @param {object} opt - Passport options
 * @property {string} opt.strategy - Passport strategy
 * @property {object} [opt.options] - Passport strategy options
 * @param {Routable} app
 * @returns {KoaActionFunction}
 */
const passportAuth = (opt, app) => {
    if (!opt || !opt.strategy) {
        throw new InvalidConfiguration('Missing strategy name.', app, 'middlewares.passportAuth.strategy');
    }

    let passportService = app.getService('passport');

    if (!passportService) {
        throw new InvalidConfiguration('Passport feature is not enabled.', app, 'passport');
    }

    return passportService.authenticate(opt.strategy, opt.options);
};

export default passportAuth;

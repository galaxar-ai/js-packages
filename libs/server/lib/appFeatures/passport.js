"use strict";

/**
 * Enable passport feature
 * @module Feature_Passport
 */

const path = require('path');
const { _, eachAsync_ } = require('@genx/july');
const { Feature } = require('..').Enums;
const { InvalidConfiguration } = require('@genx/error');

module.exports = {

    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.SERVICE,

    /**
     * Load the feature
     * @param {Routable} app - The app module object
     * @param {object} config - Passport settings
     * @property {bool} [config.useSession=false] - Use session or not, default: false
     *  
     * @property {object} config.init - Passport initialization settings     
     * @property {string} [config.init.userProperty='user'] - User property name, default: user      
     * 
     * @property {array} config.strategies - Passport strategies, e.g. [ 'local', 'facebook' ]
     * @property {array} config.exposeToServer - Expose the passport servcie to while server
     * @returns {Promise.<*>}
     */
    load_: function (app, config) {
        const KoaPassport = app.tryRequire('koa-passport').KoaPassport;
        let passport = new KoaPassport();
        if (_.isEmpty(config) || _.isEmpty(config.strategies)) {
            throw new InvalidConfiguration(
                'Missing passport strategies.',
                app,
                'passport.strategies'
            );
        }        

        let initializeMiddleware = passport.initialize(config.init);

        passport.middlewares = config.useSession ? [ initializeMiddleware, passport.session() ] : initializeMiddleware;

        app.on('before:' + Feature.READY, () => {
            app.useMiddlewares(app.router, passport.middlewares);
        });

        passport.hasStrategy = (name) => {
            return name in passport._strategies;
        };

        app.registerService('passport', passport);        

        if (config.exposeToServer && app !== app.server) {
            app.server.registerService('passport', passport);
        }

        let strategies = Array.isArray(config.strategies) ? config.strategies : [ config.strategies ];

        return eachAsync_(strategies, async strategy => {
            let strategyScript = path.join(app.backendPath, 'passports', strategy + '.js');
            let strategyInitiator = require(strategyScript);
            return strategyInitiator(app, passport);
        });
    }
};
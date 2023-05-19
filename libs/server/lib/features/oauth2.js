'use strict';

/**
 * Enable oauth2 feature
 * @module Feature_OAuth2
 */

const path = require('path');
const { Feature } = require('..').Enums;
const { dependsOn } = require('@genx/app/lib/utils/Helpers');

module.exports = {
    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.PLUGIN,

    /**
     * Load the feature
     * @param {Routable} app - The app module object
     * @param {object} config - Passport config
     * @returns {Promise.<*>}
     */
    load_: function (app, config) {
        dependsOn('passport', app, 'oauth2');

        /*
        let passport = app.getService('passport');
        if (!passport.hasStrategy('basic')) {
            throw new Error('oauth2 requires "basic" passport strategy.');
        }

        if (!passport.hasStrategy('oauth2-client-password')) {
            throw new Error('oauth2 requires "oauth2-client-password" passport strategy.');
        }*/

        /**
         * Module dependencies.
         */
        const oauth2orize = app.tryRequire('oauth2orize-koa');

        // create OAuth 2.0 server
        const server = oauth2orize.createServer();

        let strategy, strategyScript;

        try {
            strategyScript = path.join(app.backendPath, 'oauth2', 'strategy.js');
            let strategyInitiator = require(strategyScript);
            strategy = strategyInitiator(app, server);

            if (!strategy) {
                throw new Error(`Invalid oauth2 strategy.`);
            }
        } catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                throw new Error(`oauth2 strategy file "${strategyScript}" not found.`);
            }

            throw error;
        }

        // Register serialialization and deserialization functions.
        //
        // When a client redirects a user to user authorization endpoint, an
        // authorization transaction is initiated.  To complete the transaction, the
        // user must authenticate and approve the authorization request.  Because this
        // may involve multiple HTTP request/response exchanges, the transaction is
        // stored in the session.
        //
        // An application must supply serialization functions, which determine how the
        // client object is serialized into the session.  Typically this will be a
        // simple matter of serializing the client's ID, and deserializing by finding
        // the client by ID from the database.

        server.serializeClient(strategy.serializeClient);

        server.deserializeClient(strategy.deserializeClient);

        // Register supported grant types.
        //
        // OAuth 2.0 specifies a framework that allows users to grant client
        // applications limited access to their protected resources.  It does this
        // through a process of the user granting access, and the client exchanging
        // the grant for an access token.

        // Grant authorization codes.  The callback takes the `client` requesting
        // authorization, the `redirectURI` (which is used as a verifier in the
        // subsequent exchange), the authenticated `user` granting access, and
        // their response, which contains approved scope, duration, etc. as parsed by
        // the application.  The application issues a code, which is bound to these
        // values, and will be exchanged for an access token.

        server.grant(oauth2orize.grant.code(strategy.grantCode));

        // Exchange authorization codes for access tokens.  The callback accepts the
        // `client`, which is exchanging `code` and any `redirectURI` from the
        // authorization request for verification.  If these values are validated, the
        // application issues an access token on behalf of the user who authorized the
        // code.

        server.exchange(oauth2orize.exchange.code(strategy.exchangeCode));

        // user authorization endpoint
        //
        // `authorization` middleware accepts a `validate` callback which is
        // responsible for validating the client making the authorization request.  In
        // doing so, is recommended that the `redirectURI` be checked against a
        // registered value, although security requirements may vary accross
        // implementations.  Once validated, the `done` callback must be invoked with
        // a `client` instance, as well as the `redirectURI` to which the user will be
        // redirected after an authorization decision is obtained.
        //
        // This middleware simply initializes a new authorization transaction.  It is
        // the application's responsibility to authenticate the user and render a dialog
        // to obtain their approval (displaying details about the client requesting
        // authorization).  We accomplish that here by routing through `ensureLoggedIn()`
        // first, and rendering the `dialog` view.

        app.registerMiddlewareFactory('oauth2Authorization', () => [
            'passportCheck',
            server.authorize(strategy.authorize),
        ]);

        // user decision endpoint
        //
        // `decision` middleware processes a user's decision to allow or deny access
        // requested by a client application.  Based on the grant type requested by the
        // client, the above grant middleware configured above will be invoked to send
        // a response.

        app.registerMiddlewareFactory('oauth2Decision', () => ['passportCheck', server.decision()]);

        // token endpoint
        //
        // `token` middleware handles client requests to exchange authorization grants
        // for access tokens.  Based on the grant type being exchanged, the above
        // exchange middleware will be invoked to handle the request.  Clients must
        // authenticate when making requests to this endpoint.

        app.registerMiddlewareFactory('oauth2Token', () => [
            [
                'passportAuth',
                {
                    strategy: ['basic', 'oauth2-client-password'],
                    options: { session: false },
                },
            ],
            server.token(),
            server.errorHandler(),
        ]);
    },
};

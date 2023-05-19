/**
 * Enable middleware factory
 * @module Feature_MiddlewareFactory
 *
 * @example
 *   "middlewareFactory": {
 *       //new middleware name
 *       "listOfMiddleware": {
 *           "middleware1": { // options
 *               ...
 *           },
 *           "middleware2": { // options
 *               ...
 *           }
 *       },
 *        "altListOfMiddleware": [
 *           {
 *               "name": "middleware1",
 *               "options": { ... }
 *           },
 *           [ "middleware2", { ... } ],
 *           "middleware3"
 *       ]
 *   },
 */

import { _, isPlainObject } from '@galaxar/utils';
import { Feature } from '@galaxar/app';
import { InvalidConfiguration } from '@galaxar/types';

export default {
    /**
     * This feature is loaded at init stage
     * @member {string}
     */
    stage: Feature.INIT,

    /**
     * Load the feature
     * @param {App} app - The app module object
     * @param {object} factories - Object factories
     * @returns {Promise.<*>}
     */
    load_: (app, factories) => {
        _.each(factories, (factoryInfo, name) => {
            app.registerMiddlewareFactory(name, (opt, targetApp) => {
                if (!_.isEmpty(opt)) {
                    throw new InvalidConfiguration(
                        'Middleware factory should be used with empty options.',
                        app,
                        `middlewareFactory.${name}`
                    );
                }

                let chains;

                if (isPlainObject(factoryInfo)) {
                    chains = [];

                    _.each(factoryInfo, (options, middleware) => {
                        chains.push(app.getMiddlewareFactory(middleware)(options, targetApp));
                    });
                } else if (Array.isArray(factoryInfo)) {
                    chains = factoryInfo.map((middlewareInfo, i) => {
                        if (isPlainObject(middlewareInfo)) {
                            if (!middlewareInfo.name) {
                                throw new InvalidConfiguration(
                                    'Missing referenced middleware name.',
                                    app,
                                    `middlewareFactory.${name}[${i}].name`
                                );
                            }

                            return app.getMiddlewareFactory(middlewareInfo.name)(middlewareInfo.options, targetApp);
                        }

                        if (Array.isArray(middlewareInfo)) {
                            if (
                                middlewareInfo.length < 1 ||
                                middlewareInfo.length > 2 ||
                                typeof middlewareInfo[0] !== 'string'
                            ) {
                                throw new InvalidConfiguration(
                                    'Invalid middleware factory item config.',
                                    app,
                                    `middlewareFactory.${name}[${i}]`
                                );
                            }

                            return app.getMiddlewareFactory(middlewareInfo[0])(
                                middlewareInfo.length > 1 ? middlewareInfo[1] : undefined,
                                targetApp
                            );
                        }

                        if (typeof middlewareInfo === 'string') {
                            return app.getMiddlewareFactory(middlewareInfo)(undefined, targetApp);
                        }

                        throw new InvalidConfiguration(
                            'Invalid middleware factory item config.',
                            app,
                            `middlewareFactory.${name}[${i}]`
                        );
                    });
                } else {
                    throw new InvalidConfiguration(
                        'Invalid middleware factory config.',
                        app,
                        `middlewareFactory.${name}`
                    );
                }

                return chains.length === 1 ? chains[0] : chains;
            });
        });
    },
};

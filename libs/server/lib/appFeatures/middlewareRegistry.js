/**
 * Enable middleware registry, to register middleware for later use.
 * @module Feature_MiddlewareRegistry
 *
 * @example
 *   "middlewareRegistry": {
 *       "middleware1": { // options
 *               ...
 *           },
 *           "middleware2": { // options
 *               ...
 *           }
 *       },
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
     * @param {object} middlewares - Object factories
     * @returns {Promise.<*>}
     */
    load_: (app, middlewares) => {
        _.each(middlewares, (options, name) => {
            

            this.registerMiddlewareFactory(text.baseName(file), require(file))
        });
    },
};

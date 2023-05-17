/**
 * Enable multi-categories logging by pino logger
 * @module Feature_Logger
 */

import Feature from '../Feature';
import { _ } from '@galaxar/utils';

/*
 logger: {
     transport: {
        target: '/absolute/path/to/my-transport.mjs'
     }
 }

 logger: {
    transport: {
    targets: [
      { target: '/absolute/path/to/my-transport.mjs', level: 'error' },
      { target: 'some-file-transport', options: { destination: '/dev/null' }
    ]
 }    
*/
export default {
    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    stage: Feature.SERVICE,

    groupable: true,

    /**
     * Load the feature
     * @param {App} app - The cli app module object
     * @param {object} categories - Configuration for multi-categories
     * @returns {Promise.<*>}
     * @example
     *
     *  let logger = app.getService('logger');
     *  logger.log('error', 'error');
     *
     *  // with serviceGroup
     *  let logger1 = app.getService('logger-category1');
     */
    load_: function (app, config, name) {
        const pino = app.tryRequire('pino');

        const options = {
            nestedKey: 'payload',
            transport: {
                target: 'pino-pretty',
            },
            ...config,
        };

        const names = name.split('-', 2);
        let isAppLogger = true;

        if (names.length > 1) {
            options.name = names[1];
            isAppLogger = false;
        }

        const logger = pino({
            level: app.options.logLevel === 'verbose' ? 'debug' : app.options.logLevel,
            ...options,
        });

        if (isAppLogger) {
            logger.verbose = logger.debug.bind(logger);

            if (app._logCache.length > 0) {
                app._logCache.forEach(([level, message, obj]) => logger[level](obj, message));
            }
            
            app.logger = logger;
            app.log = (level, message, info) => {
                logger[level](info, message);
                return this;
            };            
        }

        app.registerService(name, logger);
    },
};

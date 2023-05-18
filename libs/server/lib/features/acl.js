"use strict";

/**
 * Enable acl feature
 * @module Feature_Acl
 */

const { _, eachAsync_ } = require('@galaxar/utils');
const { Feature } = require('..').Enums;
const { InvalidConfiguration } = require('@galaxar/types');

module.exports = {

    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.PLUGIN,

    /**
     * Load the feature
     * @param {Routable} app - The app module object
     * @param {object} config - Acl settings
     * @property {string} config.backend - Backend store type of acl, memory, mongodb, redis
     * @property {string} [config.dataSource] - Store type of acl
     * @property {object} [config.prefix] - Store options
     * @returns {Promise.<*>}
     * 
     * @example
     * 
     * acl: {
     *   backend: 'mongodb.dataSourceName'
     * }
     */
    load_: async function (app, config) {
        const Acl = app.tryRequire('acl');
        let backend = config.backend || 'memory';
        let backendType, backendStore;

        if (backend.indexOf('.') > 0) {
            backendType = '';
        }

        switch (backend) {
            case 'memory':
            backendStore = new Acl.memoryBackend();
            break;

            case 'mongodb':
            if (!config.dataSource) {
                throw new InvalidConfiguration('"dataSource" is required for mongodb backend of acl.', app, 'acl.dataSource');
            }

            let mongodb = app.getService(config.dataSource);
            if (!mongodb) {
                throw new InvalidConfiguration(`Data source "${config.dataSource}" not found.`, app, 'acl.dataSource');
            }

            backendStore = new Acl.mongodbBackend(await mongodb.connect_(), config.prefix);
            break;

            case 'redis':
            throw new Error('to be implemented');
            break;

            default:
            throw new InvalidConfiguration('Unsupported acl backend: ' + backend, app, 'acl.backend');
        }        
    
        app.acl = new Acl(backendStore);       
    }
};
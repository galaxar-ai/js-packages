/**
 * Enable custom config identified by config path.
 * @module Feature_CustomConfig
 */

import path from 'node:path';
import { JsonConfigProvider } from '@galaxar/jsonc';
import Feature from '../Feature';

export default {

    /**
     * This feature is loaded at configuration stage
     * @member {string}
     */
    type: Feature.CONF,

    /**
     * Load the feature
     * @param {App} app - The cli app module object
     * @param {string} configPath - Custom config file path
     * @returns {Promise.<*>}
     */
    load_: async (app, configPath) => {
        app.configLoader.provider = new JsonConfigProvider(path.resolve(configPath));
        return app.loadConfig_();
    }
};
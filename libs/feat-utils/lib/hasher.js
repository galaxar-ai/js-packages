import { Feature } from "@galaxar/app";

/**
 * Hasher, get the hash of a buffer/string/stream/file.
 * @module Feature_Hasher
 */

export default {
    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    stage: Feature.SERVICE,

    /**
     * Load the feature
     * @param {App} app - The app module object
     * @param {object} [options] - Options for the feature
     * @returns {Promise.<*>}
     *
     * @see[methods]{@link https://github.com/sindresorhus/hasha}
     *
     */
    load_: async function (app, options, name) {
        const hasha = app.tryRequire('hasha');
        app.registerService(name, hasha);
    },
};

const { Feature } = require('@galaxar/app');

/**
 * Fast image processor (sharp)
 * @module Feature_ImageProcessor
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
     * @see[methods]{@link https://sharp.pixelplumbing.com}
     *
     */
    load_: async function (app, options, name) {
        const Sharp = app.tryRequire('sharp');
        const service = {
            fromFile: (fileName, opts) => new Sharp(fileName, opts),
            fromBuffer: (buffer, opts) => new Sharp(buffer, opts && { raw: opts }),
            create: (opts) => new Sharp(opts && { create: opts }),
        };

        app.registerService(name, service);
    },
};

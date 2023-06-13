const {
    Enums: { Feature },
    Helpers: { tryRequire },
} = require("@genx/app");

module.exports = {
    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.SERVICE,

    /**
     * This feature can be grouped by serviceGroup
     * @member {boolean}
     */
     groupable: false,

    /**
     * Feature loader
     * @param {App} app - The app which is loading this feature
     * @param {object} options - Options for the feature, from app config
     * @param {string} name - Service name assigned by the service container
     * @returns {Promise.<*>}
     */
    load_: async function (app, options, name) {
        //create service object here
        
        //app.registerService(name, service);
    },
};

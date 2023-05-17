const {
    Feature,
    Helpers: { ensureFeatureName },
} = require("@genx/app");

module.exports = {
    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.SERVICE,

    load_: async function (app, config, name) {
        ensureFeatureName(name);

        const { param } = config;

        const service = {
            getParam: () => param,
        };

        app.registerService(name, service);
    },
};

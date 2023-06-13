const updateFile_ = require("./updateFile_");
const { REGISTRY_GENX, REGISTRY_NPMJS } = require("../constants");

module.exports = async (app, targetPath, options) => {
    await updateFile_(app, targetPath, ".npmrc", (vars) => {
        const { registry, ...otherVars } = vars;

        if (options.registry !== "npmjs") {
            let _registry = options.registry;

            return {
                ...otherVars,
                registry: _registry,
            };
        } else if (registry) {
            return {
                ...otherVars,
                registry: REGISTRY_NPMJS,
            };
        }

        return otherVars;
    });
};

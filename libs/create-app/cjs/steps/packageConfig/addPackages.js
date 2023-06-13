"use strict";
module.exports = async (config, options)=>{
    if (options.dependencies) {
        config.dependencies = {
            ...config.dependencies,
            ...options.dependencies
        };
    }
    if (options.devDependencies) {
        config.devDependencies = {
            ...config.devDependencies,
            ...options.devDependencies
        };
    }
};

//# sourceMappingURL=addPackages.js.map
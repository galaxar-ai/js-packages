"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _utils = require("@galaxar/utils");
const addDependency = (dependencies, isForDevMode)=>(config, templateMetadata, options)=>{
        // split by ":" and override
        dependencies = _utils._.castArray(dependencies);
        if (isForDevMode) {
            config.devDependencies = {
                ...config.devDependencies,
                ...dependencies
            };
        } else {
            config.dependencies = {
                ...config.dependencies,
                ...dependencies
            };
        }
    };
const _default = addDependency;

//# sourceMappingURL=addDependency.js.map
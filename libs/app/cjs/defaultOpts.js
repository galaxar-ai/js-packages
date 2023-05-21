"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    defaultAppOpts: function() {
        return defaultAppOpts;
    },
    default: function() {
        return _default;
    }
});
const defaultOpts = {
    env: process.env.NODE_ENV || 'development',
    configPath: 'conf',
    configName: 'app',
    featuresPath: 'features',
    loadConfigFromOptions: false,
    disableEnvAwareConfig: false,
    allowedFeatures: undefined
};
const defaultAppOpts = {
    logger: undefined,
    logLevel: 'info',
    ignoreUncaught: false,
    exitOnUncaught: true,
    libModulesPath: 'libs'
};
const _default = defaultOpts;

//# sourceMappingURL=defaultOpts.js.map
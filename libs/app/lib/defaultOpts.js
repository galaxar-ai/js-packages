const defaultOpts = {
    env: process.env.NODE_ENV || 'development',
    configPath: 'conf',
    configName: 'app',
    featuresPath: 'features',
    loadConfigFromOptions: false,
    disableEnvAwareConfig: false,
    allowedFeatures: undefined, // whitelist
};

export const defaultAppOpts = {
    logger: undefined,
    logLevel: 'info',
    ignoreUncaught: false,
    exitOnUncaught: true,
    libModulesPath: 'libs',
};

export default defaultOpts;

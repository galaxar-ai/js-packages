const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps',
    // for nodemon to use the source files
    sourcePath: process.env.GX_SOURCE_PATH ?? 'server',
};

export const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,

    publicPath: 'public',
    controllersPath: 'actions',
    middlewaresPath: 'middlewares',
};

export const defaultWebModuleOpts = {
    sourcePath: process.env.GX_SOURCE_PATH ?? 'server',
};

export default defaultOpts;

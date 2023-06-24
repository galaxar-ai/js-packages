const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps'
};

export const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,
    // for nodemon to use the source files
    sourcePath: process.env.GX_SOURCE_PATH ?? 'server',
    publicPath: 'public',
    controllersPath: 'actions',
    middlewaresPath: 'middlewares',
};

export default defaultOpts;

const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps',
    sourcePath: 'server',
};

export const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,
    sourcePath: 'server',
    publicPath: 'public',
    controllersPath: 'actions',
    middlewaresPath: 'middlewares',
};

export default defaultOpts;

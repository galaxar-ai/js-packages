const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps',
    middlewaresPath: 'middlewares',
};

export const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,
    publicPath: 'public',
    controllersPath: 'actions',
};

export default defaultOpts;

const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps',
};

export const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,
    publicPath: 'public',
    controllersPath: 'actions',
    middlewaresPath: 'middlewares',
};

export default defaultOpts;

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
    defaultRoutableOpts: function() {
        return defaultRoutableOpts;
    },
    defaultWebModuleOpts: function() {
        return defaultWebModuleOpts;
    },
    default: function() {
        return _default;
    }
});
const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps',
    // for nodemon to use the source files
    sourcePath: process.env.GX_SOURCE_PATH ?? 'server'
};
const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,
    publicPath: 'public',
    controllersPath: 'actions',
    middlewaresPath: 'middlewares'
};
const defaultWebModuleOpts = {
    sourcePath: process.env.GX_SOURCE_PATH ?? 'server'
};
const _default = defaultOpts;

//# sourceMappingURL=defaultOpts.js.map
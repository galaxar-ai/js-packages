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
    default: function() {
        return _default;
    }
});
const defaultOpts = {
    configName: 'server',
    appModulesPath: 'apps'
};
const defaultRoutableOpts = {
    engine: 'koa',
    traceMiddlewares: false,
    // for nodemon to use the source files
    sourcePath: process.env.GX_SOURCE_PATH ?? 'server',
    publicPath: 'public',
    controllersPath: 'actions',
    middlewaresPath: 'middlewares'
};
const _default = defaultOpts;

//# sourceMappingURL=defaultOpts.js.map
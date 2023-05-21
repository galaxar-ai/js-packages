/**
 * Enable middleware factory
 * @module Feature_MiddlewareFactory
 *
 * @example
 *   "middlewareFactory": {
 *       //new middleware name
 *       "listOfMiddleware": {
 *           "middleware1": { // options
 *               ...
 *           },
 *           "middleware2": { // options
 *               ...
 *           }
 *       },
 *        "altListOfMiddleware": [
 *           {
 *               "name": "middleware1",
 *               "options": { ... }
 *           },
 *           [ "middleware2", { ... } ],
 *           "middleware3"
 *       ]
 *   },
 */ "use strict";
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
const _app = require("@galaxar/app");
const _types = require("@galaxar/types");
const _default = {
    /**
     * This feature is loaded at init stage
     * @member {string}
     */ stage: _app.Feature.INIT,
    /**
     * Load the feature
     * @param {App} app - The app module object
     * @param {object} factories - Object factories
     * @returns {Promise.<*>}
     */ load_: (app, factories)=>{
        _utils._.each(factories, (factoryInfo, name)=>{
            app.registerMiddlewareFactory(name, (opt, targetApp)=>{
                if (!_utils._.isEmpty(opt)) {
                    throw new _types.InvalidConfiguration('Middleware factory should be used with empty options.', app, `middlewareFactory.${name}`);
                }
                let chains;
                if ((0, _utils.isPlainObject)(factoryInfo)) {
                    chains = [];
                    _utils._.each(factoryInfo, (options, middleware)=>{
                        chains.push(app.getMiddlewareFactory(middleware)(options, targetApp));
                    });
                } else if (Array.isArray(factoryInfo)) {
                    chains = factoryInfo.map((middlewareInfo, i)=>{
                        if ((0, _utils.isPlainObject)(middlewareInfo)) {
                            if (!middlewareInfo.name) {
                                throw new _types.InvalidConfiguration('Missing referenced middleware name.', app, `middlewareFactory.${name}[${i}].name`);
                            }
                            return app.getMiddlewareFactory(middlewareInfo.name)(middlewareInfo.options, targetApp);
                        }
                        if (Array.isArray(middlewareInfo)) {
                            if (middlewareInfo.length < 1 || middlewareInfo.length > 2 || typeof middlewareInfo[0] !== 'string') {
                                throw new _types.InvalidConfiguration('Invalid middleware factory item config.', app, `middlewareFactory.${name}[${i}]`);
                            }
                            return app.getMiddlewareFactory(middlewareInfo[0])(middlewareInfo.length > 1 ? middlewareInfo[1] : undefined, targetApp);
                        }
                        if (typeof middlewareInfo === 'string') {
                            return app.getMiddlewareFactory(middlewareInfo)(undefined, targetApp);
                        }
                        throw new _types.InvalidConfiguration('Invalid middleware factory item config.', app, `middlewareFactory.${name}[${i}]`);
                    });
                } else {
                    throw new _types.InvalidConfiguration('Invalid middleware factory config.', app, `middlewareFactory.${name}`);
                }
                return chains.length === 1 ? chains[0] : chains;
            });
        });
    }
};

//# sourceMappingURL=middlewareFactory.js.map
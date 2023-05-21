/**
 * Enable web request routing.
 * @module Feature_Routing
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
const _app = require("@galaxar/app");
const _utils = require("@galaxar/utils");
const _default = {
    /**
     * This feature is loaded at ready (final) stage.
     * @member {string}
     */ stage: _app.Feature.PLUGIN,
    /**
     * Load the feature.
     * @param {Routable} app - The app module object
     * @param {object} routes - Routes and configuration
     * @returns {Promise.<*>}
     */ load_: (app, routes)=>{
        app.on('after:' + _app.Feature.PLUGIN, ()=>(0, _utils.batchAsync_)(routes, async (routersConfig, route)=>{
                if ((0, _utils.isPlainObject)(routersConfig)) {
                    return (0, _utils.batchAsync_)(routersConfig, async (options, type)=>{
                        let loader_ = (0, _utils.esmCheck)(require('../routers/' + type));
                        app.log('verbose', `A "${type}" router is created at "${route}" in app [${app.name}].`);
                        return loader_(app, route, options);
                    });
                } else {
                    // 'route': 'method:/path'
                    let mainRoute = '/', baseRoute = route;
                    let pos = route.indexOf(':/');
                    if (pos !== -1) {
                        mainRoute = route.substring(0, pos + 2);
                        baseRoute = route.substring(pos + 1);
                    } else if (Array.isArray(routersConfig)) {
                        //all handled by middleware chains
                        mainRoute = 'all:/';
                    }
                    let rules = {
                        [mainRoute]: routersConfig
                    };
                    const loader_ = (0, _utils.esmCheck)(require('../routers/rule'));
                    app.log('verbose', `A "rule" router is created at "${baseRoute}" in app [${app.name}].`);
                    return loader_(app, baseRoute, {
                        rules: rules
                    });
                }
            }));
    }
};

//# sourceMappingURL=routing.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _glob = require("glob");
const _utils = require("@galaxar/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Gaml router.
 * @module Router_Gaml
 */ const appendId = (baseEndpoint, idName)=>idName ? `${baseEndpoint}/:${idName}` : baseEndpoint;
/**
 * Create a gaml router.
 * @param {*} app
 * @param {string} baseRoute
 * @param {object} options
 * @property {string} [options.resourcesPath]
 * @property {object|array} [options.middlewares]
 * @example
 *  '<base path>': {
 *      gaml: {
 *          resourcesPath:
 *          middlewares:
 *      }
 *  }
 *
 *  route                          http method    function of ctrl
 *  /:resource                     get            find
 *  /:resource                     post           post
 *  /:resource/:id                 get            findById
 *  /:resource/:id                 put            updateById
 *  /:resource/:id                 del            deleteById
 */ const gamlRouter = (app, baseRoute, options)=>{
    const Router = app.tryRequire('@koa/router');
    let resourcePath = _nodepath.default.resolve(app.sourcePath, options.resourcesPath || 'resources');
    let router = baseRoute === '/' ? new Router() : new Router({
        prefix: _utils.text.dropIfEndsWith(baseRoute, '/')
    });
    app.useMiddleware(router, app.getMiddlewareFactory('jsonError')(options.errorOptions, app), 'jsonError');
    if (options.middlewares) {
        app.useMiddlewares(router, options.middlewares);
    }
    let resourcesPath = _nodepath.default.join(resourcePath, '**/*.js');
    let files = (0, _glob.globSync)(resourcesPath);
    _utils._.each(files, (filepath)=>{
        let controller = (0, _utils.esmCheck)(require(filepath));
        if (typeof controller === 'function') {
            controller = new controller(app);
        }
        const relativePath = _nodepath.default.relative(resourcePath, filepath);
        const dirPath = _nodepath.default.dirname(relativePath);
        const entityName = _nodepath.default.basename(relativePath, '.js');
        const entithNameWithPath = _nodepath.default.join(dirPath, entityName);
        let baseEndpoint;
        if (options.remaps && entithNameWithPath in options.remaps) {
            baseEndpoint = _utils.text.ensureStartsWith(_utils.text.dropIfEndsWith(options.remaps[entithNameWithPath], '/'), '/');
        } else {
            const urlPath = entithNameWithPath.split('/').map((p)=>_utils.naming.kebabCase(p)).join('/');
            baseEndpoint = _utils.text.ensureStartsWith(urlPath, '/');
        }
        let idName = _utils.naming.camelCase(entityName) + 'Id';
        let endpointWithId = appendId(baseEndpoint, idName);
        if ((0, _utils.hasMethod)(controller, 'find')) {
            const _action = controller.find.bind(controller);
            const _middlewares = controller.find.__metaMiddlewares;
            app.addRoute(router, 'get', baseEndpoint, _middlewares ? [
                ..._middlewares,
                _action
            ] : _action);
        }
        if ((0, _utils.hasMethod)(controller, 'post')) {
            const _action = controller.post.bind(controller);
            const _middlewares = controller.post.__metaMiddlewares;
            app.addRoute(router, 'post', baseEndpoint, _middlewares ? [
                ..._middlewares,
                _action
            ] : _action);
        }
        if ((0, _utils.hasMethod)(controller, 'findById')) {
            const _action = (ctx)=>controller.findById(ctx, ctx.params[idName]);
            const _middlewares = controller.findById.__metaMiddlewares;
            app.addRoute(router, 'get', endpointWithId, _middlewares ? [
                ..._middlewares,
                _action
            ] : _action);
        }
        if ((0, _utils.hasMethod)(controller, 'updateById')) {
            const _action = (ctx)=>controller.updateById(ctx, ctx.params[idName]);
            const _middlewares = controller.updateById.__metaMiddlewares;
            app.addRoute(router, 'put', endpointWithId, _middlewares ? [
                ..._middlewares,
                _action
            ] : _action);
        }
        if ((0, _utils.hasMethod)(controller, 'deleteById')) {
            const _action = (ctx)=>controller.deleteById(ctx, ctx.params[idName]);
            const _middlewares = controller.deleteById.__metaMiddlewares;
            app.addRoute(router, 'del', endpointWithId, _middlewares ? [
                ..._middlewares,
                _action
            ] : _action);
        }
    });
    app.addRouter(router);
};
const _default = gamlRouter;

//# sourceMappingURL=gaml.js.map
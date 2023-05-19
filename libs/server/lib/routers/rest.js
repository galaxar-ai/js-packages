import path from 'node:path';
import { _, text, hasMethod, esmCheck } from '@galaxar/utils';
import { globSync } from 'glob';

/**
 * RESTful router.
 * @module Router_Rest
 */

/**
 * Create a RESTful router.
 * @param {*} app
 * @param {string} baseRoute
 * @param {objects} options
 * @property {string} [options.resourcesPath]
 * @property {object|array} [options.middlewares]
 * @example
 *  '<base path>': {
 *      rest: {
 *          resourcesPath:
 *          middlewares:
 *      }
 *  }
 *
 *  route                          http method    function of ctrl
 *  /:resource                     get            query
 *  /:resource                     post           create
 *  /:resource/:id                 get            detail
 *  /:resource/:id                 put            update
 *  /:resource/:id                 delete         remove
 */
const restRouter = (app, baseRoute, options) => {
    const Router = app.tryRequire('@koa/router');

    let resourcePath = path.resolve(app.sourcePath, options.resourcesPath ?? 'resources');

    let router = baseRoute === '/' ? new Router() : new Router({ prefix: text.dropIfEndsWith(baseRoute, '/') });

    app.useMiddleware(router, app.getMiddlewareFactory('jsonError')(options.errorOptions, app), 'jsonError');

    if (options.middlewares) {
        app.useMiddlewares(router, options.middlewares);
    }

    let resourcesPath = path.join(resourcePath, '**', '*.js');
    let files = globSync(resourcesPath, { nodir: true });

    _.each(files, (file) => {
        let relPath = path.relative(resourcePath, file);
        let batchUrl = text.ensureStartsWith(
            relPath
                .substring(0, relPath.length - 3)
                .split(path.sep)
                .map((p) => _.kebabCase(p))
                .join('/'),
            '/'
        );
        let singleUrl = batchUrl + '/:id';

        let controller = esmCheck(require(file));

        if (typeof controller === 'function') {
            controller = new controller(app);
        }

        if (hasMethod(controller, 'query')) {
            app.addRoute(router, 'get', batchUrl, (ctx) => controller.query(ctx));
        }

        if (hasMethod(controller, 'create')) {
            app.addRoute(router, 'post', batchUrl, (ctx) => controller.create(ctx));
        }

        if (hasMethod(controller, 'detail')) {
            app.addRoute(router, 'get', singleUrl, (ctx) => controller.detail(ctx));
        }

        if (hasMethod(controller, 'update')) {
            app.addRoute(router, 'put', singleUrl, (ctx) => controller.update(ctx));
        }

        if (hasMethod(controller, 'remove')) {
            app.addRoute(router, 'del', singleUrl, (ctx) => controller.remove(ctx));
        }
    });

    app.addRouter(router);
};

export default restRouter;

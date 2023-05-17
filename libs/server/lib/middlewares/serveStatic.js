/**
 * Static file server middleware.
 * @module Middleware_ServeStatic
 */

const serveStatic = (options, app) => {
    const koaStatic = app.tryRequire('koa-static');

    return koaStatic(app.publicPath, options);
};

export default serveStatic;

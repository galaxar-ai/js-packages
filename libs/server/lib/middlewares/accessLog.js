/**
 * Add access log for every http request
 * @module Middleware_AccessLog
 */

module.exports = (opt, app) => {
    const pinoHttp = app.tryRequire('pino-http');

    app.requireFeatures(['logger'], 'accessLog');

    const log = pinoHttp({ quietReqLogger: true, ...opt, logger: app.logger });

    return (ctx, next) => {
        log(ctx.req, ctx.res);
        ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
        return next();
    };
};

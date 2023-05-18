/**
 * Add access log for every http request
 * @module Middleware_AccessLog
 */

import http from 'node:http';
import { InvalidConfiguration } from "@galaxar/types";

module.exports = (opt, app) => {        
    const pinoHttp = app.tryRequire('pino-http')

    app.requireFeatures([ 'logger' ], 'accessLog');    

    const log = pinoHttp({ quietReqLogger: true, logger: app.logger  });

    return (ctx, next) => {
        log(ctx.req, ctx.res);
        return next();
    };
};
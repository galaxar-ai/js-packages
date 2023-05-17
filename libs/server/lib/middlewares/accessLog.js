/**
 * Add access log for every http request
 * @module Middleware_AccessLog
 */

import { InvalidConfiguration } from "@galaxar/types";
import http from 'node:http';

module.exports = (opt, app) => {        
    app.requireFeatures([ 'loggers' ], app, 'accessLog');    

    if (!opt.logger) {
        throw new InvalidConfiguration('Missing logger id.', app, 'middlewares.accessLog.logger');
    }

    let logger = app.getService('logger.' + opt.logger);
    if (!logger) {
        throw new InvalidConfiguration('Logger not found. Id: ' + opt.logger, app, 'middlewares.accessLog.logger');
    }

    return async (ctx, next) => {
        let startAt = app.now();       

        await next();        

        let info = {
            ip: ctx.ip, // should use ip middleware to extract the real ip behind lb
            method: ctx.method,
            url: ctx.url,
            originalUrl: ctx.originalUrl,           
            httpVersion: ctx.req.httpVersion,        
            protocol: ctx.protocol.toUpperCase(),
            status: ctx.status,
            size: ctx.length || '-',
            referer: ctx.header['referer'] || '-',
            userAgent: ctx.header['user-agent'] || '-',
            isoTimestamp: startAt.toISO(),        
            duration: app.now().diff(startAt).milliseconds
        };

        let level = 'info';

        if (ctx.status >= 500) {
            level = 'error';
        } else if (ctx.status >= 400) {
            level = 'warn';
        }
        
        logger.log(level, http.STATUS_CODES[ctx.status], info);
    };
};
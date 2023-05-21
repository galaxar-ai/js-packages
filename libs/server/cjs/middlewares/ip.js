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
const IPV4_PREFIX = '::ffff:';
const IPV4_LOCALHOST = '::1';
const ip = (options, app)=>{
    const requestIp = app.tryRequire('request-ip');
    return async (ctx, next)=>{
        let ip = requestIp.getClientIp(ctx.req);
        if (ip.startsWith(IPV4_PREFIX)) {
            ip = ip.substring(IPV4_PREFIX.length);
        }
        if (ip === IPV4_LOCALHOST) {
            ip = '127.0.0.1';
        }
        ctx.request.ip = ip;
        ctx.req.info = {
            remoteAddress: ip,
            remotePort: ctx.req.socket.remotePort
        };
        return next();
    };
};
const _default = ip;

//# sourceMappingURL=ip.js.map
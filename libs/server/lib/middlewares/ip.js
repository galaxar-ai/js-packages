
const IPV4_PREFIX = '::ffff:';

const ip = (options, app) => {
    const requestIp = app.tryRequire('request-ip');

    return async (ctx, next) => {   
        let ip = requestIp.getClientIp(ctx.req);

        if (ip.startsWith(IPV4_PREFIX)) {
            ip = ip.substring(IPV4_PREFIX.length);
        }

        ctx.request.ip = ip;               

        return next();
    };
};

export default ip;
"use strict";

/**
 * Socket based Rpc Server
 * @module Feature_SocketServer
 * 
 * middleware: (packet, next) => {}
 */

const path = require('path');
const { _, url: urlUtil, text } = require('@galaxar/utils');
const {
    Feature,
    Helpers: { ensureFeatureName },
} = require("@genx/app");
const { InvalidConfiguration } = require('@galaxar/types');

const DEFAULT_CONTROLLER_PATH = 'events';

function loadEventHandler(appModule, namespace, controllerBasePath, handlerName, isMiddleware = false) {
    let pos = handlerName.lastIndexOf('.');
    if (pos < 0) {
        if (isMiddleware) {
            throw new InvalidConfiguration(
                `Invalid middleware reference: ${handlerName}`,
                appModule,
                namespace ? `socketServer.routes["${namespace}"].middlewares` : 'socketServer.middlewares'
            );
        } else {
            throw new InvalidConfiguration(
                `Invalid event handler reference: ${handlerName}`,
                appModule,
                `socketServer.routes["${namespace}"].events`
            );
        }
    }

    let controller = handlerName.substring(0, pos);
    let action = handlerName.substring(pos + 1);

    let controllerPath = path.resolve(controllerBasePath, controller + '.js');
    let ctrl = require(controllerPath);
    
    let middlewareHandler = ctrl[action];
    if (typeof middlewareHandler !== 'function') {
        if (isMiddleware) {
            throw new InvalidConfiguration(
                `Middleware function not found: ${handlerName}`,
                appModule,
                namespace ? `socketServer.routes["${namespace}"].middlewares` : 'socketServer.middlewares'
            );
        } else {
            throw new InvalidConfiguration(
                `Event handler function not found: ${handlerName}`,
                appModule,
                `socketServer.routes["${namespace}"].events`
            );
        }
    }

    return middlewareHandler;
}

function startSocketServer(appModule, serviceName, config) {
    const ioServer = appModule.tryRequire('socket.io');

    let { port, logger, path: wsPath, ...options } = config;

    if (logger && typeof logger === 'string') {
        logger = appModule.getService('logger.' + logger);
    }

    function log(...args) {
        logger && logger.log(...args);
    }

    function logError(error) {
        logger && logger.log('error', error.message || error);
    }

    let io, standalone = false;

    let endpointPath = wsPath ? urlUtil.join(appModule.route, wsPath) : appModule.route;
    endpointPath = text.ensureStartsWith(endpointPath, '/');

    options.path = endpointPath;

    if (port) {
        io = ioServer(options);
        standalone = true;
        appModule.log('verbose', `A standalone socket server is listening at [port=${port}, path=${endpointPath}].`);        
    } else {
        io = ioServer(appModule.server.httpServer, options);
        port = appModule.server.port;
        appModule.log('verbose', `A socket server is listening at [path=${endpointPath}].`);        
    }

    io.on('connection', socket => {
        log('info', 'client connect', {
            endpoint: endpointPath,
            port,
            id: socket.id,
            ...socket.handshake
        });

        socket.on('disconnect', () => {
            log('info', 'client disconnect', { 
                endpoint: endpointPath,
                port,
                id: socket.id
            });
        });
    });

    let controllersPath = path.resolve(appModule.backendPath, config.controllersPath || DEFAULT_CONTROLLER_PATH);

    if (config.middlewares) {
        io.use(loadEventHandler(appModule, null, controllersPath, middlewareName, true));
    }

    if (_.isEmpty(config.routes)) {
        throw new InvalidConfiguration(
            'Missing routes config.',
            appModule,
            'socketServer.routes'
        );
    }        

    _.forOwn(config.routes, (info, name) => {
        name = text.ensureStartsWith(name, '/');

        let namespaceChannel = io.of(name);

        if (info.middlewares) {
            let m = Array.isArray(info.middlewares) ? info.middlewares : [ info.middlewares ];
            m.forEach(middlewareName => {
                namespaceChannel.use(loadEventHandler(appModule, name, controllersPath, middlewareName, true));
            });
        }

        let eventHandlers;

        if (!info.controller) {               
            throw new InvalidConfiguration(
                'Missing controller.',
                appModule,
                `socketServer.routes[${name}]`
            );
        }
            
        let rpcControllerPath = path.resolve(controllersPath, info.controller + '.js');
        let isObj = false;
        const controllerObj = require(rpcControllerPath);
        if (typeof controllerObj === 'function') {
            eventHandlers = new controllerObj(appModule);
            isObj = true;
        } else {
            eventHandlers = controllerObj;
        }

        appModule.log('verbose', `[${serviceName}] controller "${info.controller}" is attached for namespace "${name}".`);    

        const _eventHandlers = {};
        
        info.events && _.each(info.events, (methodName, eventName) => {
            if (typeof eventHandlers[methodName] === 'function') {
                _eventHandlers[eventName] = eventHandlers[methodName];
            }
        });

        function invoke(ctx, data, fn, cb) {
            console.log('invoke ..........');

            if (isObj) {
                fn = fn.bind(eventHandlers);
            }
        
            fn(ctx, data).then(result => result != null && cb && cb(result)).catch(logError);
        }
        
        namespaceChannel.on('connect', function (socket) {
            let ctx = { appModule, socket };  

            //Register event handlers
            _.forOwn(_eventHandlers, (handler, event) => {
                socket.on(event, (data, cb) => invoke(ctx, data, handler, cb));
            });                

            if (eventHandlers.onConnect) {                
                invoke(ctx, null, eventHandlers.onConnect);
            }      
            
            log('verbose', 'namespace connect', { 
                endpoint: endpointPath,
                port,
                id: socket.id, 
                namespace: name 
            });       
        });
    });

    if (standalone) {
        io.listen(config.port);
    }

    return io;
}

module.exports = {

    /**
     * This feature is loaded at plugin stage
     * @member {string}
     */
    type: Feature.PLUGIN,

    groupable: true,

    /**
     * The socket server options.
     * @typedef {Object} ServerOptions
     * @property {string} [path=/socket.io] - name of the path to capture
     * @property {boolean} [serveClient=true] - whether to serve the client files
     * @property {Adapter} adapter - the adapter to use. Defaults to an instance of the Adapter that ships with socket.io which is memory based. See socket.io-adapter
     * @property {string} origins - the allowed origins
     * @property {Parser} parser - the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser
     * @see {@link https://socket.io/docs/server-api/} for more options
     */

    /**
     * Load the rpc Server
     * @param {AppModule} app - The app module object
     * @param {ServerOptions} options - Rpc server config
     */
    load_: (app, options, name) => {   
        ensureFeatureName(name);

        let io = startSocketServer(app, name, options);

        //default socket server
        app.registerService(name, io);
    }
};
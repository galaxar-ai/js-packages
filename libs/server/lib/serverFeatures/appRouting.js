/**
 * Enable routing web requests to a child app.
 * @module Feature_AppRouting
 * 
 * @example
 *  
 *  'appRouting': {
 *      '<mounting point>': {
 *          name: 'app name', 
 *          npmModule: false, // whether is a npm module
 *          options: { // module options 
 *          },
 *          settings: { // can override module defined settings
 *          },
 *          middlewares: { // can override middlewares 
 *          }
 *      }
 *  } 
 */

import path from "node:path";
import { _, batchAsync_ } from "@galaxar/utils";
import { fs, isDir_ } from "@galaxar/sys";
import { InvalidConfiguration } from "@galaxar/types";
import { Feature } from "@galaxar/app";

import WebModule from "../WebModule";

export default {

    /**
     * This feature is loaded at plugin stage.
     * @member {string}
     */
    stage: Feature.PLUGIN,

    /**
     * Load the feature.
     * @param {WebServer} server - The web server module object.
     * @param {object} routes - Routes and configuration.
     * @returns {Promise.<*>}
     */
    load_: async (server, routes) => batchAsync_(routes, async (config, baseRoute) => {
        if (!config.name) {
            throw new InvalidConfiguration(
                'Missing app name.',
                app,
                `appRouting.${baseRoute}.name`);
        }
    
        let options = { 
            env: server.env, 
            logLevel: server.options.logLevel,
            traceMiddlewares: server.options.traceMiddlewares,
            ...config.options
        };

        let appPath;     

        if (config.npmModule) {
            appPath = server.toAbsolutePath('node_modules', config.name);
        } else {
            appPath = path.join(server.appModulesPath, config.name);
        }

        let exists = (await fs.pathExists(appPath)) && (await isDir_(appPath));
        if (!exists) {
            throw new InvalidConfiguration(
                `App [${config.name}] not found at ${appPath}`,
                server,
                `appRouting.${baseRoute}.name`);
        }
    
        let app = new WebModule(server, config.name, baseRoute, appPath, options);
        app.now = server.now;
        
        app.on('configLoaded', () => {
            if (!_.isEmpty(config.overrides)) {
                Object.assign(app.config, config.overrides);
                server.log('verbose', "App config is overrided.");
            }

            if (!_.isEmpty(config.settings)) {
                app.config.settings = Object.assign({}, app.config.settings, config.settings);
                server.log('verbose', `App settings of [${app.name}] is overrided.`);
            }

            if (!_.isEmpty(config.middlewares)) {
                let middlewaresToAppend = app.config.middlewares;
                app.config.middlewares = { ...config.middlewares };
                _.defaults(app.config.middlewares, middlewaresToAppend);
            }
        });

        let relativePath = path.relative(server.workingPath, appPath);
        server.log('verbose', `Loading app [${app.name}] from "${relativePath}" ...`);
    
        await app.start_();
        
        server.log('verbose', `App [${app.name}] is loaded.`);

        //delayed the app routes mounting after all plugins of the server are loaded
        server.on('before:' + Feature.FINAL, () => {
            server.mountApp(app);
        });        
    })
};
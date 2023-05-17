"use strict";

const path = require("path");
const { _, url: urlUtil, text } = require("@genx/july");
const Literal = require("../enum/Literal");
const Router = require("@koa/router");
const { InvalidConfiguration } = require("@genx/error");

/**
 * Module router for mounting a specific controller.
 * @module Router_Module
 */

/**
 * Create a module-based router.
 * @param {Routable} app
 * @param {string} baseRoute
 * @param {*} moduleItem
 * @example
 *   '<base path>': {
 *       module: {
 *           middlewares:
 *           controller:
 *       }
 *   }
 *
 *   '<base path>': {
 *       module: "controller"
 *   }
 */
module.exports = function (app, baseRoute, moduleItem) {
    let controllerPath = path.join(app.backendPath, Literal.CONTROLLERS_PATH);

    if (typeof moduleItem === "string") {
        // [ 'controllerName' ]
        moduleItem = {
            controller: moduleItem,
        };
    }

    let currentPrefix = urlUtil.join(baseRoute, moduleItem.route || "/");
    let router = currentPrefix === "/" ? new Router() : new Router({ prefix: text.dropIfEndsWith(currentPrefix, "/") });

    if (moduleItem.middlewares) {
        //module-wide middlewares
        app.useMiddlewares(router, moduleItem.middlewares);
    }

    const controllers = _.castArray(moduleItem.controller);

    controllers.forEach((moduleController) => {
        let controllerFile = path.join(controllerPath, moduleController + ".js");
        let controller;

        controller = require(controllerFile);
        let isController = false;

        if (typeof controller === "function") {
            controller = new controller(app);
            isController = true;
        }

        for (let actionName in controller) {
            let action = controller[actionName];
            if (typeof action !== "function" || !action.__metaHttpMethod) continue; // only marked httpMethod should be mounted

            const method = action.__metaHttpMethod;
            let subRoute = text.ensureStartsWith(action.__metaRoute || _.kebabCase(actionName), "/");

            let bindAction;

            if (isController) {
                bindAction = action.bind(controller);
            } else {
                bindAction = action;
            }

            if (!Literal.ALLOWED_HTTP_METHODS.has(method)) {
                throw new InvalidConfiguration(
                    "Unsupported http method: " + method,
                    app,
                    `routing.${baseRoute}.modules ${moduleItem.controller}.${actionName}`
                );
            }

            app.addRoute(
                router,
                method,
                subRoute,
                action.__metaMiddlewares ? action.__metaMiddlewares.concat([bindAction]) : bindAction
            );
        }
    });

    app.addRouter(router);
};

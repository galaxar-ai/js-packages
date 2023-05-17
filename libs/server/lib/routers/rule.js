"use strict";

const { _, text } = require("@genx/july");
const Router = require("@koa/router");
const { InvalidConfiguration } = require("@genx/error");
const Literal = require("../enum/Literal");

/**
 * Rule based router.
 * @module Router_Rule
 */

/**
 * Create a rule-based router.
 * @param {WebModule} app
 * @param {string} baseRoute
 * @param {object} options
 * @example
 * '<base path>': {
 *     rule: {
 *         middlewares:
 *         rules: {
 *             // type 1, default is "get", methods mapped to one action
 *             '<sub route>': '<controller with relative path>.<action>',
 *
 *             // type 2, different methods mapped to different method
 *             '<sub route>': {
 *                '<method>': '<controller with relative path>.<action>'
 *             },
 *
 *             // type 3, with middleware
 *             '<sub route>': {
 *                 '<method>': {
 *                    '<middleware name>': { //middleware options }
 *                 }
 *             },
 *
 *             // type 4, all methods mapped to one action
 *             '<method>:/<sub route>': '<controller with relative path>.<action>'
 *
 *             // type 5, all methods mapped to one action
 *             '<method>:/<sub route>': {
 *                 '<middleware name>': { //middleware options }
 *             }
 *         }
 *     }
 * }
 */
function load_(app, baseRoute, options) {
    let router = baseRoute === "/" ? new Router() : new Router({ prefix: text.dropIfEndsWith(baseRoute, "/") });

    if (options.middlewares) {
        app.useMiddlewares(router, options.middlewares);
    }

    _.forOwn(options.rules || {}, (methods, subRoute) => {
        let pos = subRoute.indexOf(":/");

        if (pos !== -1) {
            if (pos === 0) {
                throw new InvalidConfiguration(
                    "Invalid route rule syntax: " + subRoute,
                    app,
                    `routing[${baseRoute}].rule.rules`
                );
            }

            // like get:/, or post:/

            let embeddedMethod = subRoute.substr(0, pos).toLocaleLowerCase();
            subRoute = subRoute.substr(pos + 2);

            methods = { [embeddedMethod]: methods };
        }

        subRoute = text.ensureStartsWith(subRoute, "/");

        if (typeof methods === "string" || Array.isArray(methods)) {
            methods = { get: methods };
        }

        _.forOwn(methods, (middlewares, method) => {
            if (!Literal.ALLOWED_HTTP_METHODS.has(method) && method !== "all") {
                throw new InvalidConfiguration(
                    "Unsupported http method: " + method,
                    app,
                    `routing[${baseRoute}].rule.rules[${subRoute}]`
                );
            }

            app.addRoute(router, method, subRoute, middlewares);
        });
    });

    app.addRouter(router);
}

module.exports = load_;

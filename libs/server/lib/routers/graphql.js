"use strict";

const path = require('path');
const { InvalidConfiguration } = require('@galaxar/types');
const Koa = require('koa');
const mount = require('koa-mount');

/**
 * GraphQL router.
 * @module Router_GraphQL
 */

/**
 * Create a GraphQL router.
 * @param {*} app 
 * @param {string} baseRoute 
 * @param {objects} options 
 * @property {string} options.schema
 * @property {object|array} [options.middlewares]
 * @property {boolean} [options.graphiql]
 * @example
 *  '<base path>': {
 *      graphql: {          
 *          middlewares: {},
 *          schema: 'graphql/schema',
 *          rootValue: '',
 *          graphiql: true
 *      }
 *  }
 */
module.exports = async (app, baseRoute, options) => {
    const graphqlHTTP = app.tryRequire('koa-graphql');        

    const { middlewares, schemaProvider, ...graphqlOpts } = options;

    if (!schemaProvider) {
        throw new InvalidConfiguration(
            'Missing schemaProvider config.',
            app,
            `routing.${baseRoute}.graphql.schemaProvider`
        );
    }

    const schemaFactory = require(path.resolve(app.backendPath, schemaProvider));
    const schemaObj = await schemaFactory(app);

    if (!schemaObj.schema) {
        throw new InvalidConfiguration(
            'The object returned from schemaProvider doesnot contain the schema body.',
            app,
            `routing.${baseRoute}.graphql.schemaProvider`
        );
    }
 
    graphqlOpts.schema = schemaObj.schema;
    if (schemaObj.rootValue) {
        graphqlOpts.rootValue = schemaObj.rootValue;
    }
    
    let router = new Koa();

    if (middlewares) {
        app.useMiddlewares(router, middlewares);
    }

    router.use(mount('/', graphqlHTTP(graphqlOpts)));
    app.router.mount(baseRoute, router);
};
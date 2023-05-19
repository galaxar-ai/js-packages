/**
 * Template rendering middleware.
 * @module Middleware_Views
 */

/**
 * Initiate the views middleware
 * @param {Object} [options] - Template options
 * @property {string} [options.extension] - Default extension for your views
 * @property {Object} [options.map] - Extensions to engines map
 * @property {Object} [options.options] - View state locals
 * @property {bool} [options.options.cache] - Flag to enable cache
 * @param {Routable} app - The owner app module
 **/
function views({ viewPath = 'views', ...options }, app) {
    const views = app.tryRequire('koa-views');
    return views(app.toAbsolutePath(viewPath), options);
}

export default views;

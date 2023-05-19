import { _, text } from '@galaxar/utils';
import { ServiceContainer, ModuleBase } from '@galaxar/app';
import Routable from './Routable';

/**
 * Web application module class.
 * @class
 * @extends Routable(LibModule)
 */
class WebModule extends ModuleBase(Routable(ServiceContainer)) {
    /**
     * @param {WebServer} server
     * @param {string} name - The name of the app module.
     * @param {string} route - The base route of the app module.
     * @param {string} appPath - The path to load the app's module files
     * @param {object} [options] - The app module's extra options defined in its parent's configuration.
     */
    constructor(server, name, route, appPath, options) {
        super(server, name, appPath, options);

        this.server = this.host;

        /**
         * Mounting route.
         * @member {string}
         */
        this.route = text.ensureStartsWith(text.dropIfEndsWith(route, '/'), '/');
    }

    /**
     * Require a module from the source path of an app module
     * @param {*} relativePath
     */
    requireFromApp(appName, relativePath) {
        return this.server.requireFromApp(appName, relativePath);
    }
}

export default WebModule;

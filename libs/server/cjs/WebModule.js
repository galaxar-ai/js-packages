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
const _utils = require("@galaxar/utils");
const _app = require("@galaxar/app");
const _Routable = /*#__PURE__*/ _interop_require_default(require("./Routable"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Web application module class.
 * @class
 * @extends Routable(LibModule)
 */ class WebModule extends (0, _app.ModuleBase)((0, _Routable.default)(_app.ServiceContainer)) {
    /**
     * Require a module from the source path of an app module
     * @param {*} relativePath
     */ requireFromApp(appName, relativePath) {
        return this.server.requireFromApp(appName, relativePath);
    }
    /**
     * @param {WebServer} server
     * @param {string} name - The name of the app module.
     * @param {string} route - The base route of the app module.
     * @param {string} appPath - The path to load the app's module files
     * @param {object} [options] - The app module's extra options defined in its parent's configuration.
     */ constructor(server, name, route, appPath, options){
        super(server, name, appPath, options);
        this.server = this.host;
        /**
         * Mounting route.
         * @member {string}
         */ this.route = _utils.text.ensureStartsWith(_utils.text.dropIfEndsWith(route, '/'), '/');
    }
}
const _default = WebModule;

//# sourceMappingURL=WebModule.js.map
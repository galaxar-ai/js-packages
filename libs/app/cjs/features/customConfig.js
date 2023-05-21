/**
 * Enable custom config identified by config path.
 * @module Feature_CustomConfig
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _jsonc = require("@galaxar/jsonc");
const _Feature = /*#__PURE__*/ _interop_require_default(require("../Feature"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    /**
     * This feature is loaded at configuration stage
     * @member {string}
     */ stage: _Feature.default.CONF,
    /**
     * Load the feature
     * @param {App} app - The cli app module object
     * @param {string} configPath - Custom config file path
     * @returns {Promise.<*>}
     */ load_: async (app, configPath)=>{
        app.configLoader.provider = new _jsonc.JsonConfigProvider(_nodepath.default.resolve(configPath));
        return app.loadConfig_();
    }
};

//# sourceMappingURL=customConfig.js.map
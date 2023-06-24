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
const _app = require("@galaxar/app");
const _default = {
    stage: _app.Feature.CONF,
    load_: async function(app, options, name) {
        options = app.featureConfig(options, {
            schema: {
                locale: {
                    type: 'text',
                    default: 'en'
                },
                timezone: {
                    type: 'text',
                    optional: true
                }
            }
        }, name);
        app.i18n = options;
    }
};

//# sourceMappingURL=i18n.js.map
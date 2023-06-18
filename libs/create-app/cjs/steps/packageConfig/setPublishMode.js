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
const setPublishMode = async (config, templateMetadata, options)=>{
    if (options.publicMode) {
        delete config.private;
        config.publishConfig = {
            access: 'public'
        };
    } else {
        delete config.publishConfig;
        config.private = true;
    }
};
const _default = setPublishMode;

//# sourceMappingURL=setPublishMode.js.map
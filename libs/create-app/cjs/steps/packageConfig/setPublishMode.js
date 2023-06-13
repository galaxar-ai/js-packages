"use strict";
module.exports = async (config, options)=>{
    if (options.publicMode) {
        delete config.private;
        config.publishConfig = {
            access: "public"
        };
    } else {
        delete config.publishConfig;
        config.private = true;
    }
};

//# sourceMappingURL=setPublishMode.js.map
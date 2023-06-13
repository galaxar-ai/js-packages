"use strict";
const getPackageManager = require('./getPackageManager');
module.exports = async (app, targetPath, options)=>{
    if (!options.skipNpmInstall) {
        const manager = getPackageManager(options);
        await manager.install_(app, targetPath);
    }
};

//# sourceMappingURL=npmInstall_.js.map
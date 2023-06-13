"use strict";
const getPackageManager = require('../getPackageManager');
module.exports = (config, options)=>{
    const manager = getPackageManager(options);
    const packageManagerVersion = manager.version();
    const packageManager = `${options.packageManager}@${packageManagerVersion}`;
    config.packageManager = packageManager;
};

//# sourceMappingURL=addPackageManager.js.map
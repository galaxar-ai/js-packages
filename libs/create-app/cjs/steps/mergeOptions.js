"use strict";
const { _  } = require('@genx/july');
const path = require('node:path');
/**
 * Merge app mode default options and command-line options.
 * @param {string} appModeDir - App mode directory path
 * @param {object} options -Command-line options
 * @returns {object} Merged options 
 */ module.exports = (appModeDir, options)=>{
    let localConfig = require(path.resolve(appModeDir, "./config"));
    if (options.useStable) {
        const stableConfig = require(path.resolve(appModeDir, './config.lts'));
        localConfig = _.defaultsDeep(stableConfig, localConfig);
    }
    return {
        ...localConfig,
        ...options
    };
};

//# sourceMappingURL=mergeOptions.js.map
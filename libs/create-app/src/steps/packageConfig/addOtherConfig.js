const { _ } = require('@genx/july');
const setPublishMode = require('./setPublishMode');

module.exports = async (config, options) => {
    if (options.otherPackageConfig) {
        Object.assign(config, options.otherPackageConfig);
    } 

    setPublishMode(config, options);
};

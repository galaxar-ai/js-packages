const { _, replaceAll } = require('@genx/july');

module.exports = async (config, options) => {
    if (options.npmScripts) {
        config.scripts = { ...config.scripts, ...options.npmScripts };
    } 

    if (options.packageManager !== 'npm') {
        config.scripts = _.mapValues(config.scripts, line => {
            return replaceAll(line, 'npm run ', `${options.packageManager} `);
        });
    } 
};

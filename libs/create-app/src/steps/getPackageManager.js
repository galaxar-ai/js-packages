let manager;

module.exports = (options) => {
    if (!manager) {
        const pm = options.packageManager;

        manager = require(`./packageManager/${pm}`);
    }

    return manager;
};

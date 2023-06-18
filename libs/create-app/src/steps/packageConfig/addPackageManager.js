import getPackageManager from "../getPackageManager";

const addPackageManager = (config, templateMetadata, options) => {
    const manager = getPackageManager(options);

    const packageManagerVersion = manager.version();

    const packageManager = `${options.packageManager}@${packageManagerVersion}`;    

    config.packageManager = packageManager;
};

export default addPackageManager;

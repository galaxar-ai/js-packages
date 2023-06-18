import * as packageManagers from './packageManager';

function getPackageManager(options) {
    return packageManagers[options.packageManager];
};

export default getPackageManager;

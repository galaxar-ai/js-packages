import { _ } from '@galaxar/utils';

const addDependency = (dependencies, isForDevMode) => (config, templateMetadata, options) => {
    // split by ":" and override
    dependencies = _.castArray(dependencies);

    if (isForDevMode) {
        config.devDependencies = { ...config.devDependencies, ...dependencies };
    } else {
        config.dependencies = { ...config.dependencies, ...dependencies };
    }
};

export default addDependency;

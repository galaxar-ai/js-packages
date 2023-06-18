const setPublishMode = async (config, templateMetadata, options) => {
    if (options.publicMode) {
        delete config.private;
        config.publishConfig = {
            access: 'public',
        };
    } else {
        delete config.publishConfig;
        config.private = true;
    }
};

export default setPublishMode;

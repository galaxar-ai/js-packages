'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const _utils = require('@galaxar/utils');
const _types = require('@galaxar/types');
const _Feature = _interop_require_default(require('../Feature'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
module.exports = {
    stage: _Feature.default.SERVICE,
    load_: async function (app, services) {
        let features = [];
        const instancesMap = {};
        _utils._.each(services, (instances, serviceName) => {
            let feature = app._loadFeature(serviceName);
            if (!feature.groupable) {
                throw new _types.InvalidConfiguration(
                    `Feature [${serviceName}] is not groupable.`,
                    app,
                    `serviceGroup.${serviceName}`
                );
            }
            features.push([feature]);
            instancesMap[serviceName] = instances;
        });
        features = app._sortFeatures(features);
        await (0, _utils.eachAsync_)(features, async ([feature]) => {
            const instances = instancesMap[feature.name];
            await (0, _utils.batchAsync_)(instances, (serviceOptions, instanceName) => {
                const fullName = `${feature.name}-${instanceName}`;
                const { load_, ...others } = feature;
                load_(app, serviceOptions, `${feature.name}-${instanceName}`);
                others.enabled = true;
                app.features[fullName] = others;
            });
        });
    },
};
//# sourceMappingURL=serviceGroup.js.map

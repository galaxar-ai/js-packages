import { _, eachAsync_, batchAsync_ } from "@galaxar/utils";
import Feature from "../Feature";


/**
 * Enable a service group
 * @module Feature_ServiceGroup
 */

module.exports = {
    /**
     * This feature is loaded at service stage
     * @member {string}
     */
    type: Feature.SERVICE,

    /**
     * Load the feature
     * @param {App} app - The app module object
     * @param {object} services - Map of services from service registration to service instance options
     * @returns {Promise.<*>}
     *
     * @example
     *
     * serviceGroup: { 's3DigitalOcean': { '<instanceName>': {  } }   }
     */
    load_: async function (app, services) {
        let features = [];
        const instancesMap = {};

        _.each(services, (instances, serviceName) => {
            let feature = app._loadFeature(serviceName);
            features.push(feature);
            instancesMap[serviceName] = instances;
        });

        features = app._sortFeatures(features);

        await eachAsync_(features, async (feature) => {
            const instances = instancesMap[feature.name];
            await batchAsync_(instances, (serviceOptions, instanceName) =>
                feature.load_(app, serviceOptions, `${serviceName}-${instanceName}`)
            );
        });
    },
};

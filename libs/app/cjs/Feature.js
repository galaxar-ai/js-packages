'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const Feature = {
    CONF: 'Config',
    INIT: 'Initial',
    SERVICE: 'Services',
    PLUGIN: 'Plugins',
    FINAL: 'Final',
    validate(featureObject) {
        return featureObject && featureObject.hasOwnProperty('stage') && typeof featureObject.load_ === 'function';
    },
};
const _default = Feature;
//# sourceMappingURL=Feature.js.map

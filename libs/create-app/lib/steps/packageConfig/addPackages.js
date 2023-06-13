"use strict";

require("source-map-support/register");

const {
  _
} = require('@genx/july');

module.exports = async (config, options) => {
  if (options.dependencies) {
    _.defaults(config.dependencies, options.dependencies);
  }

  if (options.devDependencies) {
    _.defaults(config.devDependencies, options.devDependencies);
  }
};
//# sourceMappingURL=addPackages.js.map
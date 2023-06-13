"use strict";

require("source-map-support/register");

const {
  _
} = require('@genx/july');

module.exports = async (config, options) => {
  if (options.packageConfig) {
    _.defaults(config, options.packageConfig);
  }
};
//# sourceMappingURL=addConfig.js.map
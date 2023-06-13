"use strict";

require("source-map-support/register");

const {
  _
} = require('@genx/july');

module.exports = async (config, options) => {
  if (options.npmScripts) {
    _.defaults(config.scripts, options.npmScripts);
  }
};
//# sourceMappingURL=addNpmScripts.js.map
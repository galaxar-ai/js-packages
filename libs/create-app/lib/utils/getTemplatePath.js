"use strict";

require("source-map-support/register");

const path = require("path");

module.exports = (...relativePath) => path.resolve(__dirname, "../../templates", ...relativePath);
//# sourceMappingURL=getTemplatePath.js.map
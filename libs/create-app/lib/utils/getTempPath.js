"use strict";

require("source-map-support/register");

const path = require("path");

const os = require("os");

module.exports = (...relativePath) => path.resolve(os.tmpdir(), "gx-create-app", ...relativePath);
//# sourceMappingURL=getTempPath.js.map
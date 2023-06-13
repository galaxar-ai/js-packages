"use strict";

require("source-map-support/register");

const path = require("path");

const {
  fs
} = require("@genx/sys");

module.exports = async (app, targetPath, options) => {
  if (options.disablePackageLock) {
    const destFile = path.join(targetPath, ".npmrc");
    await fs.outputFile(destFile, 'package-lock=false\n', "utf8");
    app.log('info', `Added .npmrc to disable generation of package-lock.json`);
  }
};
//# sourceMappingURL=createOptionalFiles_.js.map
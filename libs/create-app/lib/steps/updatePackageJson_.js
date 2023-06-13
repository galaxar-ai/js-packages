"use strict";

require("source-map-support/register");

const path = require("path");

const {
  fs
} = require("@genx/sys");

module.exports = async (app, rootPath, ...updaters) => {
  const packageConfigFileName = 'package.json';
  const packageConfigFile = path.join(rootPath, packageConfigFileName);
  const packageConfig = await fs.readJson(packageConfigFile);
  updaters.forEach(update => update(packageConfig));
  await fs.writeJson(packageConfigFile, packageConfig, {
    spaces: 4
  });
  app.log('info', `Updated ${packageConfigFileName}`);
};
//# sourceMappingURL=updatePackageJson_.js.map
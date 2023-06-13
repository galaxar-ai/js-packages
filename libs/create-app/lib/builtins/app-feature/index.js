"use strict";

require("source-map-support/register");

const path = require("path");

const {
  fs
} = require("@genx/sys");

const localConfig = require("./config");

const {
  steps,
  packageConfig
} = require("../..");

const getTemplatePath = require("../../utils/getTemplatePath");

module.exports = async (app, options) => {
  options = { ...localConfig,
    ...options
  };
  const targetPath = path.join(options.workingPath, options.appDir);
  fs.ensureDirSync(targetPath);
  steps.ensureSafeToCreateProject_(app, targetPath, ["package.json"]);
  const templatePath = getTemplatePath(options.appMode);
  await steps.copyFilesFromTemplate_(app, templatePath, targetPath, options);
  await steps.createOptionalFiles_(app, targetPath, options);
  await steps.updatePackageJson_(app, targetPath, config => packageConfig.setPublishMode(config, options));
  await steps.npmInstall_(app, targetPath, options);
};
//# sourceMappingURL=index.js.map
"use strict";
const { steps , packageConfig  } = require("../..");
const getTemplatePath = require("../../utils/getTemplatePath");
module.exports = async (app, options)=>{
    options = steps.mergeOptions(__dirname, options);
    const targetPath = steps.ensureTargetPath(options);
    steps.ensureSafeToCreateProject_(app, targetPath, [
        "package.json"
    ]);
    const templatePath = getTemplatePath(options.appMode);
    await steps.copyFilesFromTemplate_(app, templatePath, targetPath, options);
    await steps.updatePackageJson_(app, targetPath, options, [
        packageConfig.addPackages,
        packageConfig.addNpmScripts,
        packageConfig.addOtherConfig,
        packageConfig.addPackageManager
    ]);
    await steps.common_(app, targetPath, options);
    await steps.npmInstall_(app, targetPath, options);
};

//# sourceMappingURL=index.js.map
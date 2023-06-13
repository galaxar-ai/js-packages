"use strict";

require("source-map-support/register");

const path = require("path");

const {
  fs,
  glob
} = require("@genx/sys");

const {
  eachAsync_
} = require("@genx/july");

const copyFileFromTemplate_ = require("../utils/copyFileFromTemplate_");

module.exports = async (app, templatePath, targetPath, options, skipOverriding) => {
  const files = await glob("**/*.*", {
    cwd: templatePath,
    dot: true
  });
  await eachAsync_(files, async relativePath => {
    let sourceFile = path.join(templatePath, relativePath);
    let destFile = path.join(targetPath, relativePath);
    const ls = await fs.lstat(sourceFile);

    if (ls.isDirectory()) {
      await fs.ensureDir(destFile);
      return;
    }

    if (relativePath.endsWith(".tpl")) {
      destFile = destFile.slice(0, -4);
      relativePath = relativePath.slice(0, -4);

      if (skipOverriding && fs.existsSync(destFile)) {
        app.log('info', `Skipped existing ${relativePath}`);
        return;
      }

      await fs.ensureFile(destFile);
      await copyFileFromTemplate_(sourceFile, destFile, options);
      app.log('info', `Created ${relativePath}`);
      return;
    }

    if (skipOverriding && fs.existsSync(destFile)) {
      app.log('info', `Skipped existing ${relativePath}`);
      return;
    }

    await fs.ensureFile(destFile);
    await fs.copyFile(sourceFile, destFile);
    app.log('info', `Copied ${relativePath}`);
  });
};
//# sourceMappingURL=copyFilesFromTemplate_.js.map
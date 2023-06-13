"use strict";

require("source-map-support/register");

const path = require('path');

const {
  fs
} = require('@genx/sys');

module.exports = (app, targetPath, arrayFiles) => {
  const nonExist = arrayFiles.find(file => {
    const filePath = path.join(targetPath, file);

    if (!fs.existsSync(filePath)) {
      return file;
    }
  });

  if (nonExist) {
    throw new Error(`Missing required file: ${nonExist}`);
  }

  app.log('info', 'All required files exist.');
};
//# sourceMappingURL=requireFilesExist_.js.map
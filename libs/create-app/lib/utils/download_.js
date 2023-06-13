"use strict";

require("source-map-support/register");

const request = require('superagent');

module.exports = async (app, url, saveToPath) => {
  const dirName = path.dirname(saveToPath);
  await fs.ensureDir(dirName);
  const stream = fs.createWriteStream(saveToPath);
  return new Promise((resolve, reject) => {
    stream.on('close', () => {
      resolve();
      app.log('info', `Downloaded ${url}`);
    });
    stream.on('error', err => {
      reject(err);
    });
    request.get(url).pipe(stream);
  });
};
//# sourceMappingURL=download_.js.map
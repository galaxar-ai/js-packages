"use strict";

require("source-map-support/register");

const {
  fs
} = require("@genx/sys");

module.exports = async (sourceFile, lines) => {
  let content = await fs.readFile(sourceFile, 'utf8');
  content = content.split('\n').filter(line => lines.findIndex(token => line.includes(token)) === -1).join('\n');
  await fs.outputFile(sourceFile, content);
};
//# sourceMappingURL=deleteLines_.js.map
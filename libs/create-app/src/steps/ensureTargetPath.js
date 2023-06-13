const path = require("node:path");
const { fs } = require("@genx/sys");

module.exports = (options) => {
    const targetPath = path.join(options.workingPath, options.appDir);
    fs.ensureDirSync(targetPath);

    return targetPath;
};

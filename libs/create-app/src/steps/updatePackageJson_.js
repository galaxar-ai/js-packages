import path from "node:path";
import { fs } from "@galaxar/sys";

module.exports = async (app, rootPath, initMeta, options, updaters) => {
    const packageConfigFileName = 'package.json';
    const packageConfigFile = path.join(rootPath, packageConfigFileName);
    const packageConfig = await fs.readJson(packageConfigFile);
    
    updaters.forEach(update => update(packageConfig, initMeta, options));

    await fs.writeJson(packageConfigFile, packageConfig, { spaces: 4 });
    app.log('info', `Updated ${packageConfigFileName}`);
}
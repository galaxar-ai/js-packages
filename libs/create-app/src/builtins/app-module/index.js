const path = require("path");
const { fs } = require('@genx/sys');
const localConfig = require("./config");
const { steps, packageConfig } = require("../..");
const getTemplatePath = require("../../utils/getTemplatePath");

async function updateServerConfig_(app, options) {
    const serverConfigFileName = 'conf/server.default.json';
    const serverConfigFile = path.join(options.workingPath, serverConfigFileName);
    const serverConfig = await fs.readJson(serverConfigFile);
    const route = `/${options.appDir}`;

    if (serverConfig.appRouting) {
        if (route in serverConfig.appRouting) {
            if (serverConfig.appRouting[route].name === options.appDir) {
                app.log('info', 'Skipped updating the server default config. The app module has already been added into the "appRouting" section.');
                return;
            }

            throw new Error(`Route "${route}" already exists.`);
        }
    } else {
        serverConfig.appRouting = {};
    }    

    serverConfig.appRouting[route] = {
        name: options.appDir,
        options: {}
    };

    await fs.writeJson(serverConfigFile, serverConfig, { spaces: 4 });
    app.log('info', `Updated "appRouting" in server default config: ${serverConfigFileName}`);
}

module.exports = async (app, options) => {
    options = {
        ...localConfig,
        ...options,
    };    

    await steps.requireFilesExist_(app, options.workingPath, [
        'package.json',
        'conf/server.default.json'
    ]);

    const rootTemplatePath = getTemplatePath(options.appMode, 'root');
    await steps.copyFilesFromTemplate_(app, rootTemplatePath, options.workingPath, options, true /**skip overriding */);

    const targetPath = path.join(options.workingPath, 'app_modules', options.appDir);
    fs.ensureDirSync(targetPath);

    const templatePath = getTemplatePath(options.appMode, 'module');
    await steps.copyFilesFromTemplate_(app, templatePath, targetPath, options);

    await updateServerConfig_(app, options);   
    
    await steps.updatePackageJson_(app, targetPath, (config) => packageConfig.addPackages(config, options));    

    await steps.npmInstall_(app, options.workingPath, options);
};

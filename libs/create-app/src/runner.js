import { fs } from "@galaxar/sys";

import { appModes, appModeList, modesDetail } from "./modes";
import exitWithError from "./utils/exitWithError";
import tryDo_ from "./utils/tryDo_";

import getTempPath from "./utils/getTempPath";
import download_ from "./utils/download_";

function overrideOptions(options, cmd, validatedArgs) {
    Object.assign(options, validatedArgs);
    
    if (cmd.option("skip-install")) {
        options.skipNpmInstall = true;
    }

    if (cmd.option("lts")) {
        options.useStable = true;
    }

    if (cmd.option("public")) {
        options.publicMode = true;
    }

    options.packageManager = cmd.option("package-manager");
    options.registry = cmd.option("registry");

    options.workingPath = process.cwd();      
}

async function getInitiator_(app, appMode) {
    let templateUrl;

    if (appMode === 'custom') {
        templateUrl = cmd.option("template");          
    } else {
        templateUrl = modesDetail[appMode].url;
    }

    const templateDir = getTempPath('template');
    await fs.emptyDir(templateDir);
    await download_(app, templateUrl, templateDir); 

    return require(path.join(templateDir, 'galaxar-init.js'));
}

function validateArguments(app, cmd) {
    const appDir = cmd.argv._[0];
    const appName = cmd.option("name");
    const appMode = cmd.option("mode");
    
    if (appDir.indexOf("/") !== -1 || appDir.indexOf("\\") !== -1) {
        exitWithError(app, "App directory should not contain path separator.");
    }

    if (appName.indexOf(" ") !== -1) {
        exitWithError(app, "App name should not contain any space character.");
    }

    if (appName.split("/").length > 2) {
        exitWithError(app, 'App name should not contain more than one "/" character.');
    }

    if (!appModes.includes(appMode)) {
        exitWithError(app, `Unsupported app mode: ${appMode}`);
    }

    return {
        appDir,
        appName,
        appMode,
    };
}

const run_ = async (app) => {
    const cmd = app.commandLine;

    if (cmd.option("help")) {
        cmd.showUsage();
        return;
    }

    if (cmd.option("version")) {
        console.log(app.version);
        return;
    }

    if (cmd.option("list-modes")) {
        cmd.showBannar();
        
        console.log(`All available app modes:\n\n  - ${appModeList.map(item => item.name).join('\n  - ')}\n`);        
        return;
    }

    const validatedArgs = validateArguments(app, cmd);    

    let options;

    const configFile = cmd.option("config");
    if (configFile && fs.existsSync(configFile)) {
        options = fs.readJsonSync(configFile);
    } else {
        options = {};
    }

    //override options with command line arguments
    overrideOptions(options, cmd, validatedArgs);    

    //load initiator by url or app mode
    const init_ = await getInitiator_(app, validatedArgs.appMode);

    //ensure project folder exists
    return tryDo_(app, () => {
        return init_(app, options);
    });
};

export default run_;
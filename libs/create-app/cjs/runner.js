"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _sys = require("@galaxar/sys");
const _modes = require("./modes");
const _exitWithError = /*#__PURE__*/ _interop_require_default(require("./utils/exitWithError"));
const _tryDo_ = /*#__PURE__*/ _interop_require_default(require("./utils/tryDo_"));
const _getTempPath = /*#__PURE__*/ _interop_require_default(require("./utils/getTempPath"));
const _download_ = /*#__PURE__*/ _interop_require_default(require("./utils/download_"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function overrideOptions(options, cmd1, validatedArgs) {
    Object.assign(options, validatedArgs);
    if (cmd1.option("skip-install")) {
        options.skipNpmInstall = true;
    }
    if (cmd1.option("lts")) {
        options.useStable = true;
    }
    if (cmd1.option("public")) {
        options.publicMode = true;
    }
    options.packageManager = cmd1.option("package-manager");
    options.registry = cmd1.option("registry");
    options.workingPath = process.cwd();
}
async function getInitiator_(app, appMode) {
    let templateUrl;
    if (appMode === 'custom') {
        templateUrl = cmd.option("template");
    } else {
        templateUrl = _modes.modesDetail[appMode].url;
    }
    const templateDir = (0, _getTempPath.default)('template');
    await _sys.fs.emptyDir(templateDir);
    await (0, _download_.default)(app, templateUrl, templateDir);
    return require(path.join(templateDir, 'galaxar-init.js'));
}
function validateArguments(app, cmd1) {
    const appDir = cmd1.argv._[0];
    const appName = cmd1.option("name");
    const appMode = cmd1.option("mode");
    if (appDir.indexOf("/") !== -1 || appDir.indexOf("\\") !== -1) {
        (0, _exitWithError.default)(app, "App directory should not contain path separator.");
    }
    if (appName.indexOf(" ") !== -1) {
        (0, _exitWithError.default)(app, "App name should not contain any space character.");
    }
    if (appName.split("/").length > 2) {
        (0, _exitWithError.default)(app, 'App name should not contain more than one "/" character.');
    }
    if (!_modes.appModes.includes(appMode)) {
        (0, _exitWithError.default)(app, `Unsupported app mode: ${appMode}`);
    }
    return {
        appDir,
        appName,
        appMode
    };
}
const run_ = async (app)=>{
    const cmd1 = app.commandLine;
    if (cmd1.option("help")) {
        cmd1.showUsage();
        return;
    }
    if (cmd1.option("version")) {
        console.log(app.version);
        return;
    }
    if (cmd1.option("list-modes")) {
        cmd1.showBannar();
        console.log(`All available app modes:\n\n  - ${_modes.appModeList.map((item)=>item.name).join('\n  - ')}\n`);
        return;
    }
    const validatedArgs = validateArguments(app, cmd1);
    let options;
    const configFile = cmd1.option("config");
    if (configFile && _sys.fs.existsSync(configFile)) {
        options = _sys.fs.readJsonSync(configFile);
    } else {
        options = {};
    }
    //override options with command line arguments
    overrideOptions(options, cmd1, validatedArgs);
    //load initiator by url or app mode
    const init_ = await getInitiator_(app, validatedArgs.appMode);
    //ensure project folder exists
    return (0, _tryDo_.default)(app, ()=>{
        return init_(app, options);
    });
};
const _default = run_;

//# sourceMappingURL=runner.js.map
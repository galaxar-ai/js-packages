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
const _init_ = /*#__PURE__*/ _interop_require_default(require("./init_"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
function validateArguments(app, cmd) {
    const appDir = cmd.argv._[0];
    const appName = cmd.option("name");
    const appMode = cmd.option("mode");
    if (appDir.indexOf("/") !== -1 || appDir.indexOf("\\") !== -1) {
        (0, _exitWithError.default)(app, "App directory should not contain path separator.");
    }
    if (appName.indexOf(" ") !== -1) {
        (0, _exitWithError.default)(app, "App name should not contain any space character.");
    }
    if (appName.split("/").length > 2) {
        (0, _exitWithError.default)(app, 'App name should not contain more than one "/" character.');
    }
    if (!_modes.appModes.has(appMode)) {
        (0, _exitWithError.default)(app, `Unsupported app mode: ${appMode}`);
    }
    return {
        appDir,
        appName,
        appMode
    };
}
const run_ = async (app)=>{
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
        console.log(`All available app modes:\n\n  - ${_modes.appModeList.map((item)=>item.name).join('\n  - ')}\n`);
        return;
    }
    const validatedArgs = validateArguments(app, cmd);
    let options;
    const configFile = cmd.option("config");
    if (configFile && _sys.fs.existsSync(configFile)) {
        options = _sys.fs.readJsonSync(configFile);
    } else {
        options = {};
    }
    //override options with command line arguments
    overrideOptions(options, cmd, validatedArgs);
    return (0, _init_.default)(app, options);
};
const _default = run_;

//# sourceMappingURL=runner.js.map
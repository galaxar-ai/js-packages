"use strict";

require("source-map-support/register");

const path = require("path");

const {
  fs
} = require("@genx/sys");

const {
  appModes,
  appModeList
} = require("./modes");

const exitWithError = require("./utils/exitWithError");

const tryDo_ = require("./utils/tryDo_");

const download_ = require("./utils/download_");

const getTempPath = require("./utils/getTempPath");

const pkg = require('../package.json');

function overrideOptions(options, cmd, validatedArgs) {
  Object.assign(options, validatedArgs);

  if (cmd.option("skip-install")) {
    options.skipNpmInstall = true;
  }

  if (cmd.option("lock")) {
    delete options.disablePackageLock;
  }

  if (cmd.option("public")) {
    options.publicMode = true;
  }

  options.workingPath = process.cwd();
}

async function getInitiator_(app, appMode) {
  if (appMode.indexOf("://") > 0) {
    throw new Error('To be implemented');
  }

  return require(`./builtins/${appMode}`);
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
    appMode
  };
}

module.exports = async app => {
  const cmd = app.commandLine;

  if (cmd.option("help")) {
    cmd.showUsage();
    return;
  }

  if (cmd.option("version")) {
    console.log(pkg.version);
    return;
  }

  if (cmd.option("list-modes")) {
    cmd.showBannar();
    console.log(`All available app modes:\n\n  - ${appModeList.map(item => `${item.value}: ${item.name}`).join('\n  - ')}\n`);
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

  overrideOptions(options, cmd, validatedArgs);
  const init_ = await getInitiator_(app, validatedArgs.appMode);
  return tryDo_(app, () => {
    return init_(app, options);
  });
};
//# sourceMappingURL=runner.js.map
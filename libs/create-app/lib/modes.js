"use strict";

require("source-map-support/register");

const {
  objectToArray
} = require("@genx/july");

const CLI = 'cli';
const SERVER = 'server';
const APP_MODULE = 'app-module';
const APP_FEATURE = 'app-feature';
const REACT_LIB = 'react-lib';
const REACT_WEB = 'web';
const REACT_NATIVE = 'mobile';
const ELECTRON = 'desktop';
const modeDescriptions = {
  [SERVER]: "Web service hosting project based on @genx/server",
  [APP_MODULE]: "App module to be hosted by @genx/server",
  [APP_FEATURE]: "App feature to be used by @genx/app",
  [REACT_NATIVE]: "React native mobile app"
};
exports.appModeList = objectToArray(modeDescriptions, "value", "name");
exports.appModes = [SERVER, APP_MODULE, APP_FEATURE, REACT_NATIVE];
//# sourceMappingURL=modes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    modesDetail: function() {
        return modesDetail;
    },
    appModeList: function() {
        return appModeList;
    },
    appModes: function() {
        return appModes;
    }
});
const _utils = require("@galaxar/utils");
const CLI = 'cli';
const SERVER = 'server';
const APP_MODULE = 'app-module';
const APP_FEATURE = 'app-feature';
const REACT_WEB = 'react-web';
const REACT_NATIVE = 'react-native-mobile';
const DESKTOP_ELECTRON = 'desktop-electron';
const DESKTOP_TAURI = 'desktop-tauri';
const CUSTOM_TEMPLATE = 'custom';
const modesDetail = {
    [CLI]: {
        url: '',
        desc: 'Command line application project based on @galaxar/app'
    },
    [SERVER]: {
        url: '',
        desc: 'Web service hosting project based on @galaxar/server'
    },
    [APP_MODULE]: {
        url: '',
        desc: 'App module to be hosted by @galaxar/server'
    },
    [APP_FEATURE]: {
        url: '',
        desc: 'App feature to be used by @galaxar/app and @galaxar/server'
    },
    [CUSTOM_TEMPLATE]: {
        url: null,
        desc: 'Custom template with template url given in command line'
    }
};
const appModeList = (0, _utils.objectToArray)(modesDetail, (v, k)=>({
        name: `[${k}] - ${v.desc}`,
        value: k
    }));
const appModes = [
    CLI,
    SERVER,
    APP_MODULE,
    APP_FEATURE,
    REACT_WEB,
    REACT_NATIVE,
    DESKTOP_ELECTRON,
    DESKTOP_TAURI,
    CUSTOM_TEMPLATE
];

//# sourceMappingURL=modes.js.map
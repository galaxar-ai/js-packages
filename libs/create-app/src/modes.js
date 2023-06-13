import { objectToArray } from '@galaxar/utils';

const CLI = 'cli';
const SERVER = 'server';
const APP_MODULE = 'app-module';
const APP_FEATURE = 'app-feature';
const REACT_WEB = 'react-web';
const REACT_NATIVE = 'react-native-mobile';
const DESKTOP_ELECTRON = 'desktop-electron';
const DESKTOP_TAURI = 'desktop-tauri';
const CUSTOM_TEMPLATE = 'custom';

export const modesDetail = {
    [CLI]: {
        url: '',
        desc: 'Command line application project based on @galaxar/app',
    },
    [SERVER]: {
        url: 'https://github.com/galax-ai/gx-server-template/archive/refs/tags/v0.0.1.tar.gz',
        desc: 'Web service hosting project based on @galaxar/server',
    },
    [APP_MODULE]: {
        url: '',
        desc: 'App module to be hosted by @galaxar/server',
    },
    [APP_FEATURE]: {
        url: '',
        desc: 'App feature to be used by @galaxar/app and @galaxar/server',
    },
    [CUSTOM_TEMPLATE]: {
        url: null,
        desc: 'Custom template with template url given in command line',
    },
    //[REACT_LIB]: "React component library",
    //[REACT_WEB]: "React web app",
    //[REACT_NATIVE]: "React native mobile app",
    //[ELECTRON]: "Electron-based desktop app"
};

export const appModeList = objectToArray(modesDetail, (v, k) => ({ name: `[${k}] - ${v.desc}`, value: k }));

export const appModes = [
    CLI,
    SERVER,
    APP_MODULE,
    APP_FEATURE,
    REACT_WEB,
    REACT_NATIVE,
    DESKTOP_ELECTRON,
    DESKTOP_TAURI,
    CUSTOM_TEMPLATE,
];

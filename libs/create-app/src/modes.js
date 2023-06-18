import { objectToArray } from '@galaxar/utils';

const MONO_REPO = 'monorepo';
const CLI = 'cli';
const LIB = 'lib';
const SERVER = 'server';
const APP_MODULE = 'app-module';
const APP_FEATURE = 'app-feature';
const REACT_WEB = 'react-web';
const REACT_NATIVE = 'react-native-mobile';
const DESKTOP_ELECTRON = 'desktop-electron';
const DESKTOP_TAURI = 'desktop-tauri';
const CUSTOM_TEMPLATE = 'custom';

export const modesDetail = {
    [MONO_REPO]: {
        url: 'https://github.com/galax-ai/gx-monorepo-templates/releases/latest/download/package.tgz',
        desc: 'Monorepo for apps and packages'
    },
    [CLI]: {
        url: '',
        desc: 'Command line application project based on @galaxar/app',
    },
    [LIB]: {
        url: 'https://github.com/galax-ai/gx-js-lib-template/releases/latest/download/package.tgz',
        desc: 'Javascript library project (ES-style)',
    },
    
    [SERVER]: {
        url: 'https://github.com/galax-ai/gx-server-template/releases/latest/download/package.tgz',
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

export const appModes = new Set(Object.keys(modesDetail));

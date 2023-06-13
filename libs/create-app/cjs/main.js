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
const _app = require("@galaxar/app");
const _utils = require("@galaxar/utils");
const _modes = require("./modes");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _runner = /*#__PURE__*/ _interop_require_default(require("./runner"));
const _appNameToFileName = /*#__PURE__*/ _interop_require_default(require("./utils/appNameToFileName"));
const _packagejson = /*#__PURE__*/ _interop_require_default(require("../package.json"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function main() {
    return (0, _app.startCommand)(_runner.default, {
        loggerLevel: "verbose",
        commandName: "gx-init",
        config: {
            version: _packagejson.default.version,
            commandLine: {
                banner: ()=>_chalk.default.white.bgBlue.bold(` Galaxar application initiator command line v${_packagejson.default.version} `),
                program: "npm init @genx/app",
                arguments: [
                    {
                        name: "app-directory",
                        required: false,
                        inquire: true,
                        promptMessage: "Please enter the application directory (usually the app name):"
                    }
                ],
                options: {
                    s: {
                        desc: "Silent mode",
                        alias: [
                            "silent"
                        ],
                        bool: true,
                        default: false
                    },
                    v: {
                        desc: "Show version information",
                        alias: [
                            "version"
                        ],
                        bool: true,
                        default: false
                    },
                    l: {
                        desc: "Show a list of built-in app modes",
                        alias: [
                            "list-modes"
                        ],
                        bool: true,
                        default: false
                    },
                    h: {
                        desc: "Show usage message",
                        alias: [
                            "help"
                        ],
                        bool: true,
                        default: false
                    },
                    m: {
                        desc: "Target application mode",
                        alias: [
                            "mode"
                        ],
                        silentModeDefault: "custom",
                        inquire: true,
                        required: true,
                        promptType: "list",
                        promptMessage: "Please choose the target application mode:",
                        choicesProvider: _modes.appModeList
                    },
                    t: {
                        desc: "Custom template url",
                        alias: [
                            "template",
                            "template-url"
                        ],
                        inquire: (cli)=>{
                            return cli.argv["mode"] === "custom";
                        },
                        required: (cli)=>{
                            return cli.argv["mode"] === "custom";
                        },
                        promptMessage: "Please input the custom tempalte url:"
                    },
                    n: {
                        desc: "Application name",
                        alias: [
                            "name",
                            "app-name"
                        ],
                        inquire: true,
                        required: true,
                        promptMessage: "Please input the application name:",
                        promptDefault: (cli)=>cli.argv._[0],
                        silentModeDefault: (cli)=>cli.argv._[0]
                    },
                    c: {
                        desc: "Config path",
                        alias: [
                            "conf",
                            "config"
                        ]
                    },
                    "skip-install": {
                        desc: "Skip dependencies installation",
                        alias: [
                            "skip-npm-install"
                        ],
                        bool: true,
                        inquire: true,
                        required: true,
                        promptDefault: false,
                        silentModeDefault: false
                    },
                    manager: {
                        desc: "Specify the package manager (e.g. npm)",
                        alias: [
                            "package-manager"
                        ],
                        silentModeDefault: "pnpm",
                        inquire: true,
                        required: true,
                        promptType: "list",
                        promptMessage: "Please choose the package manager for the app:",
                        promptDefault: "pnpm",
                        choicesProvider: [
                            "npm",
                            "pnpm",
                            "yarn"
                        ].map((name)=>({
                                name,
                                value: name
                            }))
                    },
                    reg: {
                        desc: "Specify the package registry (e.g. npmjs)",
                        alias: [
                            "registry"
                        ],
                        default: "npmjs"
                    },
                    lts: {
                        desc: "Use long-term-support dependencies",
                        alias: [
                            "stable"
                        ],
                        bool: true,
                        inquire: true,
                        promptDefault: false,
                        silentModeDefault: false
                    },
                    bin: {
                        desc: "Add executable bin",
                        alias: [
                            "with-bin"
                        ],
                        bool: true,
                        inquire: (cli)=>{
                            return cli.argv["mode"] === "cli";
                        },
                        promptDefault: false
                    },
                    'bin-name': {
                        desc: "Enter the executable bin name",
                        alias: [
                            "executable-bin-name"
                        ],
                        inquire: (cli)=>{
                            return cli.argv["bin"];
                        },
                        promptDefault: (cli)=>(0, _appNameToFileName.default)(cli.argv["name"])
                    },
                    public: {
                        desc: "Create as public package",
                        bool: true,
                        inquire: true,
                        promptDefault: false,
                        silentModeDefault: false
                    }
                },
                silentMode: (cli)=>cli.argv["s"] || cli.argv["v"] || cli.argv["h"] || cli.argv["l"],
                nonValidationMode: (cli)=>cli.argv["v"] || cli.argv["h"] || cli.argv["l"],
                showUsageOnError: true,
                showArguments: false
            }
        }
    });
}
const _default = main;

//# sourceMappingURL=main.js.map
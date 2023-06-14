import { startCommand } from "@galaxar/app";
import { _ } from "@galaxar/utils";
import { appModeList } from "./modes";
import figlet from "figlet";

import runner from "./runner";
import appNameToFileName from "./utils/appNameToFileName";

import pkg from "../package.json";

function main() {
    return startCommand(runner, {
        logLevel: process.env.NODE_ENV === 'development' ? "verbose" : "info",
        commandName: "gx-init",
        config: {
            version: pkg.version,
            commandLine: {
                banner: () => {
                    return figlet.textSync("Galaxar . ai", {                        
                        horizontalLayout: 'fitted'
                      }) + '\n' +
                     `Galaxar application initiator command line v${pkg.version}`;
                },
                program: "npm init @genx/app",
                arguments: [
                    {
                        name: "app-directory",
                        required: false,
                        inquire: true,
                        promptMessage: "Please enter the application directory (usually the app name):",
                    },
                ],
                options: {
                    s: {
                        desc: "Silent mode",
                        alias: ["silent"],
                        bool: true,
                        default: false,
                    },
                    v: {
                        desc: "Show version information",
                        alias: ["version"],
                        bool: true,
                        default: false,
                    },
                    l: {
                        desc: "Show a list of built-in app modes",
                        alias: ["list-modes"],
                        bool: true,
                        default: false,
                    },
                    h: {
                        desc: "Show usage message",
                        alias: ["help"],
                        bool: true,
                        default: false,
                    },
                    m: {
                        desc: "Target application mode",
                        alias: ["mode"],
                        silentModeDefault: "custom",
                        inquire: true,
                        required: true,
                        promptType: "list",
                        promptMessage: "Please choose the target application mode:",
                        choicesProvider: appModeList,
                    },
                    t: {
                        desc: "Custom template url",
                        alias: ["template", "template-url"],
                        inquire: (cli) => {
                            return cli.argv["mode"] === "custom";
                        },
                        required: (cli) => {
                            return cli.argv["mode"] === "custom";
                        },                        
                        promptMessage: "Please input the custom tempalte url:"
                    },
                    n: {
                        desc: "Application name",
                        alias: ["name", "app-name"],
                        inquire: true,
                        required: true,
                        promptMessage: "Please input the application name:",
                        promptDefault: (cli) => cli.argv._[0],
                        silentModeDefault: (cli) => cli.argv._[0],
                    },
                    c: {
                        desc: "Config path",
                        alias: ["conf", "config"],
                    },
                    "skip-install": {
                        desc: "Skip dependencies installation",
                        alias: ["skip-npm-install"],
                        bool: true,
                        inquire: true,
                        required: true,
                        promptDefault: false,
                        silentModeDefault: false,
                    },
                    manager: {
                        desc: "Specify the package manager (e.g. npm)",
                        alias: ["package-manager"],
                        silentModeDefault: "pnpm",
                        inquire: true,
                        required: true,
                        promptType: "list",
                        promptMessage: "Please choose the package manager for the app:",
                        promptDefault: "pnpm",
                        choicesProvider: ["npm", "pnpm", "yarn"].map(name => ({ name, value: name })),
                    },
                    reg: {
                        desc: "Specify the package registry (e.g. npmjs)",
                        alias: ["registry"],
                        default: "npmjs",
                    },
                    lts: {
                        desc: "Use long-term-support dependencies",
                        alias: ["stable"],
                        bool: true,
                        inquire: true,
                        promptDefault: false,
                        silentModeDefault: false,
                    },
                    bin: {
                        desc: "Add executable bin",
                        alias: ["with-bin"],
                        bool: true,
                        inquire: (cli) => {
                            return cli.argv["mode"] === "cli";
                        },
                        promptDefault: false
                    },
                    'bin-name': {
                        desc: "Enter the executable bin name",
                        alias: ["executable-bin-name"],
                        inquire: (cli) => {
                            return cli.argv["bin"];
                        },
                        promptDefault: (cli) => appNameToFileName(cli.argv["name"])
                    },
                    public: {
                        desc: "Create as public package",
                        bool: true,
                        inquire: true,
                        promptDefault: false,
                        silentModeDefault: false,
                    },
                },
                silentMode: (cli) => cli.argv["s"] || cli.argv["v"] || cli.argv["h"] || cli.argv["l"],
                nonValidationMode: (cli) => cli.argv["v"] || cli.argv["h"] || cli.argv["l"],
                showUsageOnError: true,
                showArguments: false,
            },
        },
    });
}

export default main;
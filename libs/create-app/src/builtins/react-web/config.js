module.exports = {
    disablePackageLock: true,
    dependencies: {

    },
    devDependencies: {        
        "@babel/plugin-proposal-export-namespace-from": "^7.14.5",
        "@commitlint/cli": "^13.1.0",
        "@commitlint/config-conventional": "^13.1.0",
        "@react-native-community/eslint-config": "^2.0.0",
        "babel-plugin-module-resolver": "^4.1.0",
        eslint: "^7.14.0",
        husky: "^7.0.2",
        prettier: "^2.4.1",
    },
    npmScripts: {
        commitlint: 'commitlint --edit "$1"',
        link: "react-native link",
        lint: 'eslint "src/**/*.{js,jsx,ts,tsx}"',
        pod: "cd ios && pod install",
        prettier: "prettier --write . --ignore-unknown",
        reset: "react-native start --reset-cache",
    },
    packageConfig: {
        prettier: {
            quoteProps: "consistent",
            singleQuote: true,
            tabWidth: 4,
            trailingComma: "es5",
            useTabs: false,
        },
        eslintConfig: {
            extends: "@react-native-community",
        },
        commitlint: {
            extends: ["@commitlint/config-conventional"],
        },
    },
};

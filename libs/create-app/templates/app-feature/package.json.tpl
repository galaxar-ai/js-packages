{
    "name": "{{ appName }}",
    "version": "1.0.0",
    "description": "{{ appName }} app feature",
    "publishConfig": {
        "access": "public"
    },
    "main": "lib/index.js",
    "dependencies": {
        "@genx/app": "github:genx-tech/gx-app#v2",
        "@genx/error": "^1.1.1",
        "@genx/july": "^0.3.2",        
        "@genx/sys": "^0.1.5",
        "source-map-support": "^0.5.20"
    },
    "devDependencies": {
        "@babel/cli": "^7.14.8",
        "@babel/core": "^7.15.0",
        "@babel/plugin-proposal-class-properties": "^7.14.5",
        "@babel/plugin-proposal-decorators": "^7.14.5",
        "@babel/preset-env": "^7.15.0",
        "@babel/register": "^7.15.3",
        "@commitlint/cli": "^13.1.0",
        "@commitlint/config-conventional": "^13.1.0",
        "@genx/babelnode": "^7.14.9",
        "@genx/test": "github:genx-tech/gx-test#v2",
        "babel-plugin-source-map-support": "^2.1.3",
        "del-cli": "^4.0.1",
        "eslint": "^7.32.0",
        "eslint-config-prettier": "^8.3.0",
        "eslint-config-standard": "^16.0.3",
        "eslint-plugin-import": "^2.24.2",
        "eslint-plugin-node": "^11.1.0",
        "eslint-plugin-prettier": "^4.0.0",
        "eslint-plugin-promise": "^5.1.0",
        "husky": "^7.0.2",
        "mocha": "^9.1.1",
        "mocha-multi": "^1.1.3",
        "nodemon": "^2.0.12",
        "prettier": "^2.3.2"
    },
    "scripts": {
        "prepare": "husky install",
        "prettier": "prettier --write . --ignore-unknown",
        "lint": "eslint \"src/**/*.js\"",
        "commitlint": "commitlint --edit \"$1\"",
        "bulid:clean": "del-cli lib",
        "build": "npm run bulid:clean && NODE_ENV=production babel src -d lib --ignore \"**/__test__/*.js\" --source-maps --copy-files --no-copy-ignored",        
        "test:clean": "del-cli allure-results",
        "test": "npm run test:clean && NODE_ENV=test NODE_RT=babel mocha --reporter mocha-multi --reporter-options mocha-multi=test/mocha-multi-reporters.json test/*.spec.js",
        "cover": "npm run test:clean &&  NODE_ENV=test COVER_MODE=1 NODE_RT=babel nyc --reporter=html --reporter=text -- mocha --reporter mocha-multi --reporter-options mocha-multi=test/mocha-multi-reporters.json test/*.spec.js",
        "report": "allure generate allure-results --clean -o allure-report && allure open allure-report"
    },
    "nyc": {
        "exclude": [
            ".mocharc.js",
            "babel.config.js",
            "test",
            "lib",
            "**/*.spec.js"
        ]
    },
    "prettier": {
        "quoteProps": "consistent",
        "singleQuote": true,
        "tabWidth": 4,
        "trailingComma": "es5",
        "useTabs": false
    },
    "eslintConfig": {
        "env": {
            "browser": false,
            "commonjs": true,
            "es2021": true
        },
        "extends": [
            "standard",
            "prettier"
        ],
        "parserOptions": {
            "ecmaVersion": 12
        },
        "rules": {}
    },
    "eslintIgnore": [
        "/**/__test__"
    ],
    "commitlint": {
        "extends": [
            "@commitlint/config-conventional"
        ]
    }
}
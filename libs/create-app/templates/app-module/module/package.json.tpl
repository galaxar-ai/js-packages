{
    "name": "{{ appName }}",
    "version": "0.0.1",
    "description": "{{ appName }} app module",
    "private": true,
    "dependencies": {
        "@genx/app": "github:genx-tech/gx-app#v2",
        "@genx/server": "github:genx-tech/gx-server#v2",
        "@genx/jes": "^1.1.3",
        "@genx/july": "^0.3.2",        
        "@genx/sys": "^0.1.5",
        "luxon": "^2.0.2",
        "source-map-support": "^0.5.20"
    },
    "devDependencies": {
        "@babel/cli": "^7.14.8",
        "@babel/core": "^7.15.0",
        "@babel/plugin-proposal-class-properties": "^7.14.5",
        "@babel/plugin-proposal-decorators": "^7.14.5",
        "@babel/preset-env": "^7.15.0",
        "@babel/register": "^7.15.3",
        "@genx/babelnode": "^7.14.9",
        "@genx/test": "github:genx-tech/gx-test#v2",
        "babel-plugin-source-map-support": "^2.1.3",
        "del-cli": "^4.0.1",
        "mocha": "^9.1.1",
        "mocha-multi": "^1.1.3",
        "nodemon": "^2.0.12"
    },
    "scripts": {     
        "bulid:clean": "del server",
        "build:server": "npm run bulid:clean && NODE_ENV=production babel src -d server --ignore \"**/__test__/*.js\" --source-maps --copy-files --no-copy-ignored",
        "build": "npm run build:server"
    },
    "nyc": {
        "exclude": [
            ".mocharc.js",
            "babel.config.js",
            "test",
            "lib",
            "**/*.spec.js"
        ]
    }
}

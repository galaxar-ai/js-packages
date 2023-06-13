{
    "name": "{{ appName }}",
    "version": "0.0.1",
    "description": "{{ appName }} server",
    "scripts": {        
        "dev": "NODE_RT=babel nodemon --exec babel-node --source-maps=true src/index.js",
        "start": "NODE_RT=babel babel-node --source-maps=true src/index.js",
        "bulid:clean": "shx rm -rf server",
        "build:server": "npm run bulid:clean && NODE_ENV=production babel src -d server --ignore \"**/__test__/*.js\" --source-maps --copy-files --no-copy-ignored",
        "build": "npm run build:server",
        "test:clean": "shx rm -rf allure-results",
        "test": "npm run test:clean && NODE_RT=babel mocha --reporter mocha-multi --reporter-options mocha-multi=test/mocha-multi-reporters.json test/*.spec.js",
        "cover": "npm run test:clean && COVER_MODE=1 NODE_RT=babel nyc --reporter=html --reporter=text -- mocha --reporter mocha-multi --reporter-options mocha-multi=test/mocha-multi-reporters.json test/*.spec.js",
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
    }
}

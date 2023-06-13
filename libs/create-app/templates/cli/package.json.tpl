{
    "name": "{{ appName }}",
    "version": "0.0.1",
    "description": "{{ appName }} cli",
    "scripts": {
        "bulid:clean": "shx rm -rf server",
        "build": "npm run bulid:clean && NODE_ENV=production babel src -d build --ignore \"**/__test__/*.js\" --source-maps --copy-files --no-copy-ignored",
        "test:clean": "shx rm -rf allure-results",
        "test": "npm run test:clean && mocha --reporter mocha-multi --reporter-options mocha-multi=test/mocha-multi-reporters.json test/*.spec.js",
        "cover": "npm run test:clean && nyc --reporter=html --reporter=text -- mocha --reporter mocha-multi --reporter-options mocha-multi=test/mocha-multi-reporters.json test/*.spec.js",
        "report": "allure generate allure-results --clean -o allure-report && allure open allure-report"
    },
    "nyc": {
        "exclude": [
            ".mocharc.js",
            "babel.config.js",
            "test",
            "build",
            "**/*.spec.js",
            "**/*.test.js"
        ]
    }
}

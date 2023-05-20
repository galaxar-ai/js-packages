import path from "node:path";
import { _ } from "@galaxar/utils";

import defaultUserAuth from "./defaultUserAuth";

let allure;

/**
 * Test function with a connected rest client.
 * @callback testWithRestClient
 * @param {App} app - The app
 * @param {RestClient} client - The rest client
 */

/**
 * Test function with a worker app.
 * @callback testWithApp
 * @param {App} app - The app
 */

/**
 * Test case body.
 * @callback testCaseBody
 * @param {*} data - Test data
 */

/**
 * Test suite object.
 * @class
 */
class Suite {
    /**
     * [private] Suite will be created by testSuite creator.
     * @param {string} name - Suite name
     * @param {object} [options] - Suite options
     * @property {string} [options.serverEntry="../../src/index.js"] - The entry file of @genx/server instance.
     * @property {boolean} [options.verbose=false] - Verbose mode.
     */
    constructor(name, options) {
        this.name = name;
        const { serverEntry, verbose, testDir } = options == null ? {} : options;

        this.serverEntry = serverEntry;
        this.verbose = verbose;
        this.testDir = testDir;
    }

    /**
     * Start the @genx/server instance for code coverage testing.
     * @async
     * @private
     */
    async startWebServer_() {
        if (this.webServer) {
            throw new Error("Web server already started.");
        }

        const createWebServer = this.serverEntry
            ? require(this.serverEntry)
            : require.main.require("../../src/index.js");
        this.webServer = createWebServer({
            exitOnUncaught: false,
        });
        this.webServer.started == null || this.webServer.started.should.not.be.ok();

        await this.webServer.start_();

        this.webServer.started.should.be.ok();

        return this.webServer;
    }

    /**
     * Stop the server if it is started.
     * @async
     * @private
     */
    async stopWebServerIfStarted_() {
        if (this.webServer) {
            if (this.webServer.started) {
                await this.webServer.stop_();
            }

            delete this.webServer;
        }
    }

    /**
     * Start a worker app for testing
     * @param {testWithRestClient} testToRun - Test function with a connected rest client.
     * @param {*} options - Options passed the test worker, see startWorker of @genx/app.
     * @async
     */
    async startWorker_(testToRun, options) {
        const {
            Starters: { startWorker },
        } = require("@genx/app");

        let err;

        const result = await startWorker(
            async (app) => {
                try {
                    return await testToRun(app);
                } catch (e) {
                    err = e;
                }
            },
            {
                workerName: "tester",
                configName: "test",
                configPath: path.join(".", this.testDir, 'conf'),
                appModulesPath: "app_modules",
                ignoreUncaught: true,
                ...options,
            }
        );

        if (err) {
            throw err;
        }

        return result;
    }

    /**
     * Start a rest client for testing
     * @param {string} serviceName - The config key of target endpoint
     * @param {function|string} [authenticator] - Authenticator to be used, async (client) => {}, or pass a userTag to use default authenticator.
     * @param {testWithRestClient} testToRun - Test function with a connected rest client.
     * @param {*} [options] - Options passed the test worker, see startWorker of @genx/app.
     * @async
     */
    async startRestClient_(serviceName, authenticator, testToRun, options) {
        return this.startWorker_(async (app) => {
            if (typeof options === "undefined") {
                if (typeof testToRun === "undefined") {
                    testToRun = authenticator;
                    authenticator = null;
                } else if (typeof testToRun === "object") {
                    options = testToRun;
                    testToRun = authenticator;
                    authenticator = null;
                }
            }

            if (typeof authenticator === "string") {
                authenticator = defaultUserAuth(authenticator);
            }

            const client = await this._getRestClient_(app, serviceName, authenticator);
            return testToRun(app, client);
        }, options);
    }

    /**
     * @private
     */
    initAllure() {
        if (!allure) {
import allureMocha from "allure-mocha/runtime";
            allure = allureMocha.allure;
        }
    }

    /**
     * Define a test case.
     * @param {string} story - Test case title.
     * @param {testCaseBody} body - Test case body to write actual test code.
     * @param {object} [options]
     * @property {*} options.data - Test data
     * @property {function} options.cleanUp - Cleanup after the case ends regardless whether it is successful or not.
     */
    testCase(story, body, options) {
        const { data, cleanUp, skip, only } = options == null ? {} : options;
        const self = this;

        let opt;

        if (only) {
            opt = "only";
        } else if (skip) {
            opt = "skip";
        }

        (opt ? it[opt] : it)(story, async function () {
            if (self.verbose) {
                console.log("Starting story:", story);
            }

            if (allure) {
                if (data) {
                    const { description, epic, feature, owner, tag, issues, severity } = data.allure;

                    description && allure.description(description);
                    epic && allure.epic(epic);
                    feature && allure.feature(feature);
                    owner && allure.owner(owner);
                    tag && allure.tag(tag);
                    severity && allure.severity(severity);

                    _.isEmpty(issues) ||
                        _.forOwn(issues, (link, num) => {
                            allure.issue(num, link);
                        });
                }

                allure.story(story);
                allure.createStep(`start ${story}`, () => {})();

                if (data && data.params) {
                    _.forOwn(data.params, (v, k) => {
                        if (typeof v === "object") {
                            allure.parameter(k, "*see attachment*");
                            self.attachObject(`param[${k}]`, v);
                        } else {
                            allure.parameter(k, v);
                        }
                    });
                }
            }            

            if (cleanUp) {
                try {
                    await body(data);
                } finally {
                    await cleanUp();
                }
            } else {
                await body(data);
            }
        });
    }

    /**
     * Test case with fixtures.
     * @param {string} story
     * @param {testCaseBody} body
     * @param {Object} [options]
     */
    testCaseFromFixtures(story, body, options) {
        const p = path.resolve(this.testDir, `fixtures/${this.name}.js`);
        const suiteData = require(p);
        if (!suiteData) throw new Error(`Suite data not found. Suite: ${this.name}`);

        const { cases, ...others } = suiteData;

        let storyData = cases && cases[story];
        if (!storyData) throw new Error(`Story data not found. Suite: ${this.name}, story: ${story}`);

        storyData = _.castArray(storyData);

        const _only = storyData.filter(caseData => caseData.only);
        if (_only.length > 0) {
            storyData = _only;
        }

        storyData.forEach((caseData, i) => {
            if (caseData.skip) {
                return;
            }

            const preparedData = {
                allure: others,
                params: _.mapValues(caseData.params, (v) => {
                    if (typeof v === "function") return v();
                    return v;
                }),
                expected: caseData.expected,
            };

            const caseName = caseData.name ? `-${caseData.name}`: '';  

            this.testCase(`${story}${caseName}#${i + 1}`, body, { ...options, data: preparedData });
        });
    }

    /**
     * Run benchmark against given methods.
     * @param {*} mapOfMethods - Map of name to function with payload
     * @param {*} payload
     */
    async benchmark_(mapOfMethods, payload) {
import Benchmark from "benchmark";
        const suite = new Benchmark.Suite();

        _.each(mapOfMethods, (f, name) => {
            suite.add(name, function () {
                f(payload);
            });
        });

        return new Promise((resolve, reject) => {
            const self = this;

            suite
                .on("cycle", (event) => {
                    const cycleMessage = String(event.target);
                    console.log(cycleMessage);
                    this.attachObject("cycle", cycleMessage);
                })
                .on("complete", function () {
                    const completeMessage = "The fastest is " + this.filter("fastest").map("name");
                    console.log(completeMessage);
                    self.attachObject("complete", completeMessage);
                    resolve();
                })
                .on("error", (event) => reject(String(event.target)))
                .run({ async: true });
        });
    }

    /**
     * Define a test step.
     * @param {string} step
     * @param {function} [body] - Test step body
     */
    async testStep_(step, body) {
        const stepFn_ = allure ? allure.createStep(step, () => body()) : body;

        if (this.verbose) {
            console.log("Step: ", step);
        }

        await stepFn_();
    }

    /**
     * Attach an object to the test report.
     * @param {string} name
     * @param {*} obj
     */
    attachObject(name, obj) {
        if (!allure) return;

        let type = "text/plain",
            content = obj;

        if (typeof obj !== "string") {
            content = JSON.stringify(obj, null, 4);
            type = "application/json";
        }

        allure.createAttachment(name, content, type);
    }

    async _getRestClient_(app, name, authenticator) {
        const client = app.getService(this.webServer ? `superTest-${name}` : `restClient-${name}`);
        if (this.webServer) {
            client.server = this.webServer.httpServer;
        }

        if (!client.onSent) {
            client.onSent = (url, result) => {
                this.attachObject(url, result);
            };
        }

        if (!authenticator) {
            delete client.onSend;
            return client;
        }

        await authenticator(app, client);

        return client;
    }
}

module.exports = Suite;

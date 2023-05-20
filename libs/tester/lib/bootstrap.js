import path from 'node:path';
import fs from 'node:fs';
import _ from 'lodash';
import { esmCheck } from '@galaxar/utils';

let _initialized = false;
let _config = null;
let _asyncDump = null;
let _allure = null;

const bootstrap = () => {
    let configPath = path.resolve(process.cwd(), 'test.config.json');
    if (!fs.existsSync(configPath)) {
        configPath = path.resolve(process.cwd(), 'test/test.config.json');

        if (!fs.existsSync(configPath)) {
            throw new Error('Cannot find "test.config.json" in current directory or "./test".');
        }
    }

    _config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    processConfigSection(_config.only);
    processConfigSection(_config.skip);

    if (_config.enableAsyncDump) {
        _asyncDump = esmCheck(require('./asyncDump'));
    }

    if (_config.enableAllureReport) {
        require('allure-mocha');
        global.allure = _allure = esmCheck(require('allure-mocha/runtime')).allure;
    }
    
};

const processConfigSection = (section) => {
    if (section) {
        configFileListToHashSet(section, 'files');
        if (section.suites) {
            section.suites = _.mapValues(section.suites, (value) => {
                if (Array.isArray(value)) {
                    return new Set(value);
                }
                return value;
            });
        }
    }
};

const configFileListToHashSet = (node, listKey) => {
    const list = node[listKey];
    if (list) {
        node[listKey] = new Set(list.map((file) => path.resolve(process.cwd(), file)));
    }
};

if (!_initialized) {
    _initialized = true;
    bootstrap();
}

const _suiteVisited = new Set();

export const mochaHooks = {
    beforeEach(done) {
        const testCaseTitle = this.currentTest.title;
        const testFile = this.currentTest.file;
        const testSuiteTitle = this.currentTest.parent.title;

        const _done = () => {
            if (_allure) {
                if (!_suiteVisited.has(testSuiteTitle)) {
                    _suiteVisited.add(testSuiteTitle);
                    _allure.suite(testSuiteTitle);
                }
                _allure.story(testCaseTitle);
            }
            done();
        };

        if (_config.only) {
            // only mode
            const { files, suites } = _config.only;

            // Check if the test file, suite, or case is in the config
            // If it is not, skip the test

            if (files && !files.has(testFile)) {
                this.skip();
                return done();
            }

            if (suites) {
                const suiteInfo = suites[testSuiteTitle];
                if (suiteInfo == null) {
                    this.skip();
                    return done();
                }

                if (suiteInfo === 'all') {
                    return _done();
                }

                if (!suiteInfo.has(testCaseTitle)) {
                    this.skip();
                    return done();
                }
            }
        } else if (_config.skip) {
            // skip mode
            const { files, suites } = _config.skip;

            // Check if the test file, suite, or case is in the config
            if (files && files.has(testFile)) {
                // If it is, skip the test
                this.skip();
                return done();
            }

            if (suites) {
                const suiteInfo = suites[testSuiteTitle];
                if (suiteInfo != null) {
                    if (suiteInfo === 'all') {
                        this.skip();
                        return done();
                    }

                    if (suiteInfo.has(testCaseTitle)) {
                        this.skip();
                        return done();
                    }
                }
            }
        }

        _done();
    },
};

export const mochaGlobalTeardown = async function () {
    if (_config.enableAsyncDump) {
        _asyncDump();
    }
};

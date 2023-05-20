import path from "node:path";
import { _ } from "@galaxar/utils";
import { fs } from "@galaxar/sys";
import Suite from "./Suite";

if (process.env.ASYNC_DUMP) {
    require("./asyncDump");
}






const TEST_OPTS = "test.local.js"; 


/**
 * Test body used to define test cases.
 * @callback testSuiteBody
 * @param {Suite} suite - The test suite object
 */

/**
 * Create a test suite.
 * @param {string} [suiteName] - The test spec file name, just use __filename.
 * @param {testSuiteBody} body - To define test cased in this callback.
 * @param {object} [options]
 * @property {function} options.before - Prepare work before all test cases.
 * @property {function} options.after - Cleanup work after all test cases.
 * @property {string} [options.serverEntry="../../src/index.js"] - The entry file of @genx/server instance.
 * @property {boolean} options.verbose - Verbose mode.
 */
function testSuite(suiteName, body) {
    if (typeof options === 'undefined') {        
        if (typeof suiteName !== 'string') {
            if (typeof body !== 'undefined') {
                // two arguments
                options = body;
            } 

            body = suiteName;

            const dbgGetCallerFile = require("@galaxar/utils/cjs/dbgGetCallerFile");
            suiteName = dbgGetCallerFile();
        }
    }

    const {
        before: onBefore,
        after: onAfter,
        beforeEach: onBeforeEachCase,
        afterEach: onAfterEachCase,
        serverEntry,
        verbose,
        skip,
        only,
        testDir = 'test',
    } = options == null ? {} : options;

    const relPath = path.relative(path.resolve(process.cwd(), testDir), suiteName);
    const suiteName = relPath.substring(0, relPath.length-(suiteName.endsWith(SPECJS) ? SPECJS : DOTJS).length);

    const testOptsFile = path.resolve(testDir, TEST_OPTS);
    let testOpts;

    if (fs.existsSync(testOptsFile)) {
        testOpts = require(testOptsFile);
    }

    const suiteOptions = {
        serverEntry,
        verbose,
        testDir,
        ...(testOpts ? _.pick(testOpts, ["serverEntry", "verbose"]) : null),
    };

    const suite = new Suite(suiteName, suiteOptions);

    let opt;

    if (only) {
        opt = "only";
    } else if (skip) {
        opt = "skip";
    } else if (testOpts) {
        const only = new Set(testOpts.only);

        if (only.has(suiteName)) {
            opt = "only";
        } else {
            if (!_.isEmpty(testOpts.only)) {
                console.log(`Suite "${suiteName}" skipped.`);
                opt = "skip";
            } else {
                const skip = new Set(testOpts.skip);
                if (skip.has(suiteName)) {
                    opt = "skip";
                    console.log(`Suite "${suiteName}" skipped.`);
                }
            }
        }
    }

    (opt ? describe[opt] : describe)(suiteName, function () {
        before(async () => {
            suite.initAllure();

            if (suiteOptions.verbose) {
                console.log("Starting suite:", suiteName);
            }

            if (process.env.COVER_MODE) {
                await suite.startWebServer_();
            }

            if (onBefore) {
                await onBefore(suite);
            }
        });

        after(async () => {
            await suite.stopWebServerIfStarted_();

            if (onAfter) {
                await onAfter(suite);
            }

            console.log();
            if (suiteOptions.verbose) {
                console.log("Finished suite:", suiteName);
            }

            if (process.env.ASYNC_DUMP) {
                asyncDump(process.env.ASYNC_DUMP.length > 1 ? process.env.ASYNC_DUMP : null);
            }
        });

        if (onBeforeEachCase) {
            beforeEach(() => onBeforeEachCase(suite));
        }

        if (onAfterEachCase) {
            afterEach(() => onAfterEachCase(suite));
        }

        body(suite);
    });
}

export default testSuite;

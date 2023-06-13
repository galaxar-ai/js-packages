const testSuite = require("@genx/test");
const main = require('../src/{{ appName }}.js');

testSuite(
    __filename,
    function (suite) {
        suite.testCase("smoke test", async function () {                 
            await suite.startWorker_(async () => {
                await main();

                (true).should.be.ok();
            });
        });
    }, 
    { verbose: true }
);

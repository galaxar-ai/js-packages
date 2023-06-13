const testSuite = require("@genx/test");

testSuite(
    __filename,
    function (suite) {
        suite.testCase("smoke test", async function () {                 
            await suite.startRestClient_("default", null, async (app, client) => {
                await suite.testStep_("get home page", async () => {
                    const page = await client.get('/');
                    page.should.be.exactly('Hello world!');
                });     
            });
        });
    }, 
    { verbose: true }
);

const testSuite = require('./testSuite');

describe('Server', function () {    
    testSuite.setup('server skipping npm install', {
        'mode': 'server',
        'skip-install': true
    }, testSuite.verifyPackage_);    
    
    testSuite.setup('server with npm install', {
        'mode': 'server'
    }, testSuite.runTest_);    
});

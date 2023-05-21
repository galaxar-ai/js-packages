require('@swc-node/register');

const chai = require('chai');
global.expect = chai.expect;
chai.should();

module.exports = {
    timeout: 60000,
    require: [ '@galaxar/tester' ],
    reporter: 'mocha-multi',
    reporterOptions: 'mocha-multi=test/mocha-multi-reporters.json'
};

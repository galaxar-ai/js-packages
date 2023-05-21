require('@swc-node/register');

const chai = require('chai');
global.expect = chai.expect;
chai.should();

module.exports = {
    timeout: 300000,
    require: ['./lib/bootstrap.js'],
    reporter: 'mocha-multi',
    reporterOptions: 'mocha-multi=test/mocha-multi-reporters.json',
};

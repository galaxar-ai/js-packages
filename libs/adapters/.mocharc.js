require('@swc-node/register');

const chai = require('chai');
global.expect = chai.expect;
chai.should();

module.exports = {
    timeout: 60000
};

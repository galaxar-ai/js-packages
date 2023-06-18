require('@swc-node/register');

const chai = require('chai');
chai.use(function (chai, utils) {
    const Assertion = chai.Assertion;

    // your helpers here
    Assertion.addMethod('throws', function () {
        new Assertion(this._obj).Throw(error);
    });
});

global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();

module.exports = {
    timeout: 60000
};

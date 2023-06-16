require('@swc-node/register');

const chai = require('chai');
global.expect = chai.expect;
chai.should();
chai.use(function (chai, utils) {
    var Assertion = chai.Assertion;

    // your helpers here
    Assertion.addMethod('throws', function (error) {
        new Assertion(this._obj).Throw(error);
    });
});

module.exports = {
    timeout: 60000,
};

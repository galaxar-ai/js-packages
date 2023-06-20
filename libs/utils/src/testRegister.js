const _ = require('lodash');
const chai = require('chai');
chai.use(function (chai, utils) {
    const Assertion = chai.Assertion;

    // your helpers here
    Assertion.addMethod('throws', function (error) {
        new Assertion(this._obj).Throw(error);
    });

    Assertion.addMethod('exactly', function (value) {
        new Assertion(this._obj === value).to.be.ok;
    });

    Assertion.overwriteMethod('keys', function (_super) {
        return function assertKeys(...args) {
            const obj = this._obj;
            args.forEach((arg) => {
                this.assert(
                    _.has(obj, arg),
                    'expected #{this} to have key #{exp}',
                    'expected #{this} to not have key #{exp}',
                    arg
                );
            });
        };
    });
});

global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();

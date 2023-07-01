require('@swc-node/register');
require('@galaxar/utils/testRegister');

module.exports = {
    timeout: 300000,
    require: ['./lib/bootstrap.js'],
    reporter: 'mocha-multi',
    reporterOptions: 'mocha-multi=test/mocha-multi-reporters.json',
};

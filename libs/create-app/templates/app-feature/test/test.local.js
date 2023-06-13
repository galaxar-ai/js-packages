// copy this file to test.local.js to turn on describe.only and describe.skip
const path = require('path');

module.exports = {
    serverEntry: path.resolve(__dirname, '../src/index.js'),
    only: [        
    ],
    skip: [
    ]
}
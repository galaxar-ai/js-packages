"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { URL  } = require('node:url');
const supertestAdapter = ()=>{
    const agent = _supertest.default;
    return {
        createRequest (client, httpMethod, url) {
            let testUrl = url;
            if (url.startsWith('http://') || url.startsWith('https://')) {
                const urlObj = new URL(url);
                testUrl = urlObj.pathname;
                if (urlObj.hash) {
                    testUrl += '#' + urlObj.hash;
                }
            }
            if (!client.server) {
                throw new Error('"server" is required before sending test request.');
            }
            return agent(client.server)[httpMethod](testUrl);
        }
    };
};
const _default = supertestAdapter;

//# sourceMappingURL=supertest.js.map
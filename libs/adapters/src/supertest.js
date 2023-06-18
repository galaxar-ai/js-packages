const { URL } = require('node:url');
import supertest from 'supertest';

const supertestAdapter = () => {
    const agent = supertest;

    const agentWrapper = {
        createRequest(httpMethod, url) {
            let testUrl = url;

            if (url.startsWith('http://') || url.startsWith('https://')) {
                const urlObj = new URL(url);

                testUrl = urlObj.pathname;
                if (urlObj.hash) {
                    testUrl += '#' + urlObj.hash;
                }
            }

            if (!agentWrapper.server) {
                throw new Error('"server" of the agent is required before sending test request.');
            }

            return agent(agentWrapper.server)[httpMethod](testUrl);
        },
    };

    return agentWrapper;
};

export default supertestAdapter;

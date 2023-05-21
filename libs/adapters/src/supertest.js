const { URL } = require('node:url');
import supertest from 'supertest';

const supertestAdapter = () => {
    const agent = supertest;

    return {
        createRequest(client, httpMethod, url) {
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
        },
    };
};

export default supertestAdapter;

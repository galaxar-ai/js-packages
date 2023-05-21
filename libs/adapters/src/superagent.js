import superagent from 'superagent';

const superagentAdapter = () => {
    const agent = superagent.agent();

    return {
        createRequest(client, method, url) {
            return agent[method](url);
        },
    };
};

export default superagentAdapter;

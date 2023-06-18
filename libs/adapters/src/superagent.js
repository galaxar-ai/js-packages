import superagent from 'superagent';

const superagentAdapter = () => {
    const agent = superagent.agent();

    return {
        createRequest(method, url) {
            return agent[method](url);
        },
    };
};

export default superagentAdapter;

import exitWithError from "../utils/exitWithError";

const tryDo_ = async (app, action) => {    
    try {
        await action();
    } catch (error) {
        exitWithError(app, error.message || error);
    }
};

export default tryDo_;
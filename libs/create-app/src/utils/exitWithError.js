const exitWithError = (app, message, code = -1) => {
    app.log('error', message);
    process.exit(code);
};

export default exitWithError;
const path = require("path");
const { WebServer } = require("@genx/server");

const createWebServer = (options) =>
    new WebServer("{{ appName }}", {
        workingPath: path.resolve(__dirname, ".."),        
        logWithAppName: true,
        ...options
    });

if (module.parent) {
    // export for code coverage
    module.exports = createWebServer;
} else {
    const options = {};

    if (process.env.NODE_ENV === 'development' || process.env.NODE_RT === 'babel') {
        options.logger = {
            level: 'verbose'
        };
    }

    const webServer = createWebServer(options);
    webServer.start_().catch(error => {
        console.error(error);
    });
}

const {
    Starters: { startWorker },
} = require("@genx/app");

async function main(app) {
    app.log("info", "tbd...");
    app.log("verbose", "bla bla bla...");
}

if (module.parent) {
    // export for code coverage
    module.exports = main;
} else {
    const options = {};

    if (process.env.NODE_ENV === "development" || process.env.NODE_RT === "babel") {
        options.logger = {
            level: "verbose",
        };
    }

    startWorker(main, options)
        .then(() => {
            console.log("done.");
        })
        .catch((error) => {
            console.error(error);
            process.exit(-1);
        });
}

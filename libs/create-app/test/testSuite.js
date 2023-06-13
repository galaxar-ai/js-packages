const path = require("path");
const { fs, cmd } = require("@genx/sys");
const { _ } = require("@genx/july");

const TEMP_DIR_NAME = "temp";
const TEST_DIR = path.resolve(__dirname);
const TEMP_DIR = path.join(TEST_DIR, TEMP_DIR_NAME);

const emptyTempDir = () => {
    fs.ensureDirSync(TEST_DIR);
    fs.emptyDirSync(TEMP_DIR);
};

exports.prepareDir = emptyTempDir;

exports.verifyPackage_ = async (options) => {
    let packageFile = path.join(TEMP_DIR, "package.json");

    fs.existsSync(packageFile).should.be.ok();

    const pkg = require(packageFile);
    pkg.name.should.be.equal(options.name);
};

exports.runTest_ = async (options) => {
    process.chdir(TEMP_DIR);

    const exitCode = await cmd.runLive_(
        "npm",
        ["run", "cover"],
        (data) => {
            console.log(data.toString());
        },
        (error) => {
            console.error(error.toString());
        }
    );

    exitCode.should.be.exactly(0);
};

/**
 * @param {string} mode
 * @param {array} options
 */
exports.setup = (caseName, options, verify_) => {
    options = { name: "test", ...options };

    it(caseName, async function () {
        emptyTempDir();
        process.chdir(TEST_DIR);

        const cmdArgs = ["../bin/create-app.js", TEMP_DIR_NAME];

        if (options) {
            _.each(options, (v, k) => cmdArgs.push(typeof v === "boolean" ? (v ? `--${k}` : "") : "--" + k + "=" + v));
        }

        console.log(cmdArgs);

        await cmd.runLive_(
            "node",
            cmdArgs,
            (data) => {
                console.log(data.toString());
            },
            (error) => {
                console.error(error.toString());
            }
        );

        if (verify_) {
            await verify_(options);
        }
    });
};

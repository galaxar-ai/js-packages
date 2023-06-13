const runCommand_ = require('../runCommand_');
const { cmd } = require('@genx/sys');

exports.install_ = async (app, targetPath) => {
    await runCommand_(app, targetPath, 'npm install');
}

exports.version = () => {
    return cmd.runSync('npm --silent -v').trim();
}
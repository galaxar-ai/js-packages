const runCommand_ = require('../runCommand_');
const { cmd } = require('@genx/sys');

exports.install_ = async (app, targetPath) => {
    await runCommand_(app, targetPath, 'yarn install');
}

exports.version = () => {
    return cmd.runSync('yarn -v').trim();
}
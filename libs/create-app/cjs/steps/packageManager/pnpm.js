"use strict";
const runCommand_ = require('../runCommand_');
const { cmd  } = require('@genx/sys');
exports.install_ = async (app, targetPath)=>{
    await runCommand_(app, targetPath, 'pnpm install');
};
exports.version = ()=>{
    return cmd.runSync('pnpm -v').trim();
};

//# sourceMappingURL=pnpm.js.map
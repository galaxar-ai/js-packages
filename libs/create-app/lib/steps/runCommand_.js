"use strict";

require("source-map-support/register");

const {
  cmd
} = require("@genx/sys");

module.exports = async (app, workingPath, command, treatErrorAsInfo) => {
  const lastWd = process.cwd();
  let cwdChanged = false;

  if (workingPath !== lastWd) {
    process.chdir(workingPath);
    cwdChanged = true;
  }

  app.log('info', command);

  try {
    const [program, ...args] = command.split(' ');
    await cmd.runLive_(program, args, data => {
      app.log('info', data.toString());
    }, data => {
      if (treatErrorAsInfo) {
        app.log('info', data.toString());
      } else {
        app.log('error', data.toString());
      }
    });
  } finally {
    if (cwdChanged) {
      process.chdir(lastWd);
    }
  }
};
//# sourceMappingURL=runCommand_.js.map
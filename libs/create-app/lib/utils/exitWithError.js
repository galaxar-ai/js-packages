"use strict";

require("source-map-support/register");

module.exports = (app, message, code = -1) => {
  app.log('error', message);
  process.exit(code);
};
//# sourceMappingURL=exitWithError.js.map
"use strict";

require("source-map-support/register");

const exitWithError = require('../utils/exitWithError');

module.exports = async (app, action) => {
  try {
    await action();
  } catch (error) {
    exitWithError(app, error.message || error);
  }
};
//# sourceMappingURL=tryDo_.js.map
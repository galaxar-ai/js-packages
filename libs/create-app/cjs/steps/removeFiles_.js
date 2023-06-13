"use strict";
const path = require("path");
const { fs  } = require("@genx/sys");
const { eachAsync_  } = require("@genx/july");
module.exports = async (app, workingPath, files)=>eachAsync_(files, async (file)=>{
        await fs.unlink(path.join(workingPath, file));
        app.log("info", `Removed ${file}`);
    });

//# sourceMappingURL=removeFiles_.js.map
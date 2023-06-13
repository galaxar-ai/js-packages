import path from "node:path";
import { fs } from "@galaxar/sys";

function ensureTargetPath(options) {
    const targetPath = path.join(options.workingPath, options.appDir);
    fs.ensureDirSync(targetPath);

    return targetPath;
};

export default ensureTargetPath;
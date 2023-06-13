import path from "node:path";
import os from "node:os";

const getTempPath = (...relativePath) =>
    path.resolve(os.tmpdir(), "gx-create-app", ...relativePath);

export default getTempPath;
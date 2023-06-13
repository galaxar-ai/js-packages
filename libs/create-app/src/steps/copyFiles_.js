import path from "node:path";
import { fs } from "@galaxar/sys";
import { _, batchAsync_ } from "@galaxar/utils";
import { glob } from 'glob';

async function copyFiles_(app, templatePath, targetPath, skipOverriding) {
    const files = await glob("**/*.*", { cwd: templatePath, dot: true });
    await batchAsync_(files, async (relativePath) => {
        let sourceFile = path.join(templatePath, relativePath);
        let destFile = path.join(targetPath, relativePath);

        const ls = await fs.lstat(sourceFile);
        if (ls.isDirectory()) {
            await fs.ensureDir(destFile);
            return;
        }

        if (skipOverriding && fs.existsSync(destFile)) {
            app.log('info', `Skipped existing ${relativePath}`);       
            return;
        }

        await fs.ensureFile(destFile);
        await fs.copyFile(sourceFile, destFile);
        app.log('info', `Copied ${relativePath}`);       
    });
};

export default copyFiles_;

import path from "node:path";
import { fs } from "@galaxar/sys";

function ensureSafeToCreateProject(app, targetPath, arrayConflitFiles) {    
    const conflicts = [];

    arrayConflitFiles.forEach(file => {
        const filePath = path.join(targetPath, file);

        if (fs.existsSync(filePath)) {
            conflicts.push(file);
        }
    });

    if (conflicts.length > 0) {
        throw new Error(`The target path [${targetPath}] contains files that could conflict:\n  - ` + conflicts.join('\n  - '));
    }

    app.log("verbose", "The target path is safe to create project.");
}

export default ensureSafeToCreateProject;
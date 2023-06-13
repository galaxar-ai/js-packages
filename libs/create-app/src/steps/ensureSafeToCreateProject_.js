const path = require('path');
const { fs } = require('@genx/sys');

module.exports = (app, targetPath, arrayConflitFiles) => {    
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
}
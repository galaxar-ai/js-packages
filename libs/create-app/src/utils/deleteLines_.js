import path from 'node:path';
import { deleteLines } from "@galaxar/utils";

const deleteLines_ = async (sourceFile, lines) => {
    let content = await fs.readFile(sourceFile, 'utf8');
    content = deleteLines(content, lines, path.sep);
    await fs.outputFile(sourceFile, content);
};

export default deleteLines_;
 
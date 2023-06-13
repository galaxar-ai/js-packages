import { fs } from '@galaxar/sys';
import { template } from '@galaxar/utils';

const createFileFromTempalte_ = async (templateFile, destFile, variables) => {
    let templateContent = await fs.readFile(templateFile, 'utf8');
    let content = template(templateContent, variables);
    await fs.outputFile(destFile, content, 'utf8');
};

export default createFileFromTempalte_;

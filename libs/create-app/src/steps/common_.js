import path from 'node:path';
import { fs } from '@galaxar/sys';
import updateFile_ from './updateFile_';

module.exports = async (app, targetPath, options) => {
    const npmrcPath = path.join(targetPath, '.npmrc');
    const npmrcExists = await fs.exists(npmrcPath);

    const needUpdateNpmrc = options.registry !== 'npmjs' || npmrcExists;

    if (needUpdateNpmrc) {
        await updateFile_(app, targetPath, '.npmrc', (vars) => {
            const { registry, ...otherVars } = vars;

            if (options.registry !== 'npmjs') {
                let _registry = options.registry;

                return {
                    ...otherVars,
                    registry: _registry,
                };
            }

            return otherVars;
        });
    }

    await fs.remove(path.join(targetPath, '.galaxar.init.js'));
};

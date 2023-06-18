import path from 'node:path';
import { _, eachAsync_ } from '@galaxar/utils';
import { fs } from '@galaxar/sys';
import updateFile_ from './updateFile_';
import * as packageManagers from './packageManager';

module.exports = async (app, targetPath, initMeta, options) => {
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

    // remove files of other package manager
    const pm = options.packageManager;
    const allOtherPms = Object.keys(_.omit(packageManagers, [pm]));

    await eachAsync_(allOtherPms, async _pm => {
        const files = initMeta[_pm]?.files;
        if (files) {
            await eachAsync_(files, async file => {
                await fs.remove(path.join(targetPath, file));
            });
        }
    });    

    // remove init meta file
    await fs.remove(path.join(targetPath, '.galaxar.init.js'));
};

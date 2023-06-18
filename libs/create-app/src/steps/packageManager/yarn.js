import runCommand_ from '../runCommand_';
import { cmd } from '@galaxar/sys';

const yarn = {
    install_: async (app, targetPath) => {
        await runCommand_(app, targetPath, 'yarn install');
    },

    version: () => {
        return cmd.runSync('yarn -v').trim();
    },
};

export default yarn;

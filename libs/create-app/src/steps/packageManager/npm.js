import runCommand_ from '../runCommand_';
import { cmd } from '@galaxar/sys';

const npm = {
    install_: async (app, targetPath) => {
        await runCommand_(app, targetPath, 'npm install');
    },

    version: () => {
        return cmd.runSync('npm --silent -v').trim();
    },
};

export default npm;

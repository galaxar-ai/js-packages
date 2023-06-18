import runCommand_ from '../runCommand_';
import { cmd } from '@galaxar/sys';

const pnpm = {
    install_: async (app, targetPath) => {
        await runCommand_(app, targetPath, 'pnpm install');
    },

    version: () => {
        return cmd.runSync('pnpm -v').trim();
    },
};

export default pnpm;

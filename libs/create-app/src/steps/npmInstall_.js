import getPackageManager from "./getPackageManager";

async function npmInstall_(app, targetPath, options) {    
    if (!options.skipNpmInstall) {
        const manager = getPackageManager(options);
        await manager.install_(app, targetPath);
    }
}

export default npmInstall_;
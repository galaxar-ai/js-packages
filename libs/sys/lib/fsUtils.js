import fs from 'fs-extra';

export const isDir = (path) => fs.lstatSync(path).isDirectory();

export const isDir_ = async (path) => (await fs.lstat(path)).isDirectory();

export const isDirEmpty = (path) => fs.readdirSync(path).length === 0;

export const isDirEmpty_ = async (path) => {
    const files = await fs.readdir(path);
    return files.length === 0;
};

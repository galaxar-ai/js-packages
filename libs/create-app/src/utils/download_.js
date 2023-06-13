import request from "superagent";

const download_ = async (app, url, saveToPath) => {
    const dirName = path.dirname(saveToPath);
    await fs.ensureDir(dirName);

    const stream = fs.createWriteStream(saveToPath);

    return new Promise((resolve, reject) => {
        stream.on('close', () => {
            resolve();
            app.log('info', `Downloaded ${url}`);
        });

        stream.on('error', (err) => {
            reject(err);
        });

        request.get(url).pipe(stream);
    });
};

export default download_;
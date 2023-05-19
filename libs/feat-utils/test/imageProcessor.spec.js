import path from 'node:path';
import { fs } from '@galaxar/sys';
import { startWorker } from '@galaxar/app';

const imageFile = path.resolve(__dirname, './files/logo.png');
const generatedFile = path.resolve(__dirname, './files/output.png');

describe('image', function () {
    it('fromFile', async function () {
        await startWorker(async (app) => {
            const imageProcessor = app.getService('imageProcessor');
            should.exist(imageProcessor);

            const metadata = await imageProcessor.fromFile(imageFile).metadata();
            should.exist(metadata);
            metadata.format.should.be.exactly('png');
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });

    it('fromBuffer', async function () {
        await startWorker(async (app) => {
            const imageProcessor = app.getService('imageProcessor');
            should.exist(imageProcessor);

            const input = Uint8Array.from([255, 255, 255, 0, 0, 0]);

            await imageProcessor.fromBuffer(input, { width: 2, height: 1, channels: 3 }).toFile(generatedFile);

            const flag = await fs.exists(generatedFile);
            flag.should.be.ok();

            await fs.unlink(generatedFile);
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });

    it('createImage', async function () {
        await startWorker(async (app) => {
            const imageProcessor = app.getService('imageProcessor');
            should.exist(imageProcessor);

            await imageProcessor
                .create({
                    width: 300,
                    height: 200,
                    channels: 3,
                    noise: {
                        type: 'gaussian',
                        mean: 128,
                        sigma: 30,
                    },
                })
                .toFile(generatedFile);

            const flag = await fs.exists(generatedFile);
            flag.should.be.ok();

            await fs.unlink(generatedFile);
        }, {
            workingPath: "test",
            //logLevel: "debug"
        });
    });
});

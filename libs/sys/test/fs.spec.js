import { isDir, isDir_, isDirEmpty, isDirEmpty_ } from '../src/fsUtils';
import fs from 'fs-extra';

describe('unit:fs', function () {
    it('fs isDir', function () {
        isDir(__filename).should.not.be.ok();
        isDir(__dirname).should.be.ok();
    });

    it('fs isDir_', async function () {
        (await isDir_(__filename)).should.not.be.ok();
        (await isDir_(__dirname)).should.be.ok();
    });

    it('fs isDirEmpty', function () {
        isDirEmpty(__dirname).should.not.be.ok();

        fs.mkdirSync(__dirname + '/test');
        isDirEmpty(__dirname + '/test').should.be.ok();
        fs.rmdirSync(__dirname + '/test');
    });

    it('fs isDirEmpty_', async function () {
        (await isDirEmpty_(__dirname)).should.not.be.ok();
        fs.mkdirSync(__dirname + '/test');
        (await isDirEmpty_(__dirname + '/test')).should.be.ok();
        fs.rmdirSync(__dirname + '/test');
    });
});

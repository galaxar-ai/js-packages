const { cmd } = require('@genx/sys');

describe('BVT', function () {   
    it('usage', function () {   
        const out = cmd.runSync('node bin/create-app.js -h');
        const pkg = require('../package.json');

        out.startsWith('Gen-X application initiator command line v' + pkg.version).should.be.ok();
    });  

    it('version', function () {   
        const out = cmd.runSync('node bin/create-app.js -v');
        const pkg = require('../package.json');

        out.trim().should.be.equal(pkg.version);
    });    

    it('invalid app dir', async function () {
        let out, err;

        await cmd.runLive_('node', ['bin/create-app.js', '@test/acb', '--name=@test/acb', '--mode=server'], (data) => {
            out = data.toString();
        });

        out.trim().endsWith('App directory should not contain path separator.').should.be.ok();
    }); 

    it('invalid app name', async function () {
        let out, err;

        await cmd.runLive_('node', ['bin/create-app.js', 'temp', '--name="with space"', '--mode=server'], (data) => {
            out = data.toString();
        });

        out.trim().endsWith('App name should not contain any space character.').should.be.ok();
    });    

    it('invalid app name', async function () {
        let out, err;

        await cmd.runLive_('node', ['bin/create-app.js', 'temp', '--name=test', '--mode=something'], (data) => {
            out = data.toString();
        });

        out.trim().endsWith(`Unsupported app mode: something`).should.be.ok();
    });    
});
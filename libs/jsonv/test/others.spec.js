import Jsv from '../lib';
import enUS from '../lib/locale/en-US';

Jsv.config.loadMessages('en-US', enUS).setLocale('en-US');

describe('jsv:others', function () {
    it('sameAs', function () {
        const obj = {
            key1: 2000,
            key2: 2000,
            key3: {
                key1: 20,
                key2: 2000,
            },
            key4: null,
            key5: false,
            key6: true,
        };

        Jsv.match(obj, {
            key1: { $sameAs: 'key2' },
            key2: { $sameAs: 'key3.key2' }
        })[0].should.be.ok();
    });
});

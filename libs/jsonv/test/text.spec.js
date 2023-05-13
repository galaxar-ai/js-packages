import Jsv from '../lib';
import enUS from '../locale/en-US';

Jsv.config.loadMessages('en-US', enUS).setLocale('en-US');

describe('jsv:text', function () {
    it('startWith', function () {
        const result = Jsv.match('abc', { $startWith: 'a' });
        result[0].should.be.ok();
    });

    it('endWith', function () {
        const result = Jsv.match('abc', { $endWith: 'c' });
        result[0].should.be.ok();
    });
});

import Jsv from '../lib/bundle';

describe('jsv:message', function () {
    before(function () {
        Jsv.config.setLocale('zh-CN');
    });

    after(function () {
        Jsv.config.setLocale('en-US');
    });

    it('equal', function () {
        let obj = {
            key1: 2000,
            key2: 'ok',
            key3: {
                key1: 20,
                key2: 'ok',
            },
            key4: null,
            key5: false,
            key6: true,
        };

        
        let result = Jsv.match(obj, {
            key1: 2001,
        });

        result[0].should.not.be.ok();
        result[1].should.be.match('key1 的值必须为 2001。' );

        result = Jsv.match(obj, {
            key2: 'ng',
        });
        result[0].should.not.be.ok();
        result[1].should.be.match('key2 的值必须为 "ng"。');

        Jsv.config.setLocale('en-US');
    });
});

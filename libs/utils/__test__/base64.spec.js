import base64Encode from '../base64Encode';
import base64Decode from '../base64Decode';

describe('base64', () => {
    it('encode', () => {
        const str = 'abc';
        const base64 = base64Encode(str);
        base64.should.be.eql('YWJj');
    });

    it('decode', () => {
        const base64 = 'YWJj';
        const str = base64Decode(base64);
        str.should.be.eql('abc');
    });
});

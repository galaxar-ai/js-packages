import Jxs from '../lib';

describe('transformer:type', function () {
    it('obj', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = Jxs.evaluate(obj, '$type');
        //console.log(transformed)
        transformed.should.be.eql('object');
    });

    it('array', function () {
        let array = [1, 2, 3];

        let transformed = Jxs.evaluate(array, '$type');
        //console.log(transformed)
        transformed.should.be.eql('array');
    });

    it('num', function () {
        let num = 1.5;

        let transformed = Jxs.evaluate(num, '$type');
        //console.log(transformed)
        transformed.should.be.eql('number');
    });
});

import Jxs from '../lib';

describe('transformer:keys/values/...', function () {
    it('keys', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = Jxs.evaluate(obj, '$keys');
        //console.log(transformed)
        transformed.should.be.eql(['id', 'user', 'agency', ':user', ':agency']);
    });

    it('values', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = Jxs.evaluate(obj, '$values');
        //console.log(transformed)
        transformed.should.be.eql([
            1,
            100,
            1,
            { email: 'email1', other: 'any' },
            { name: 'agency1', other: 'any' },
        ]);
    });

    it('array:keys', function () {
        let array = [1, 2, 3];

        let transformed = Jxs.evaluate(array, '$keys');
        //console.log(transformed)
        transformed.should.be.eql(['0', '1', '2']);
    });

    it('array:values', function () {
        let array = [1, 2, 3];

        let transformed = Jxs.evaluate(array, '$values');
        //console.log(transformed)
        transformed.should.be.eql([1, 2, 3]);
    });

    it('entries', function () {
        let obj = {
            'id': 1,            
            ':user': { email: 'email1', other: 'any' }
        };

        let transformed = Jxs.evaluate(obj, '$entries');
        //console.log(transformed)
        transformed.should.be.eql([['id', 1], [':user', { email: 'email1', other: 'any' }]]);
    });

    it('toArray', function () {
        let obj = {
            'id': 1,            
            ':user': { email: 'email1', other: 'any' }
        };

        let transformed = Jxs.evaluate(obj, '$toArray');
        //console.log(transformed)
        transformed.should.be.eql([{k: 'id', v:1 }, {k:':user', v: { email: 'email1', other: 'any' }}]);
    });
});

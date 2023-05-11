import Jxs from '../lib';

describe('transformer:castArray', function () {
    it('obj', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = Jxs.evaluate(obj, '$castArray');
        //console.log(transformed)
        transformed.should.be.eql([obj]);
    });

    it('array', function () {
        let array = [1, 2, 3];

        let transformed = Jxs.evaluate(array, '$castArray');
        //console.log(transformed)
        transformed.should.be.eql(array);
    });

    it('str', function () {
        let str = 'jeoajfi';

        let transformed = Jxs.evaluate(str, '$castArray');
        //console.log(transformed)
        transformed.should.be.eql([str]);
    });

    it('null', function () {
        let a = null;

        let transformed = Jxs.evaluate(a, '$castArray');
        //console.log(transformed)
        should.not.exist(transformed);
    });
});

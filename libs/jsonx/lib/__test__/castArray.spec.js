import JES from '../../lib';

describe('transformer:castArray', function () {
    it('obj', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = JES.evaluate(obj, '$castArray');
        //console.log(transformed)
        transformed.should.be.eql([obj]);
    });

    it('array', function () {
        let array = [1, 2, 3];

        let transformed = JES.evaluate(array, '$castArray');
        //console.log(transformed)
        transformed.should.be.eql(array);
    });

    it('str', function () {
        let str = 'jeoajfi';

        let transformed = JES.evaluate(str, '$castArray');
        //console.log(transformed)
        transformed.should.be.eql([str]);
    });

    it('null', function () {
        let a = null;

        let transformed = JES.evaluate(a, '$castArray');
        //console.log(transformed)
        should.not.exist(transformed);
    });
});

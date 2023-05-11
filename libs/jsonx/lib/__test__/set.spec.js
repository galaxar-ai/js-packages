import JES from '../../lib';

describe('transformer:setValue', function () {
    it('obj', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = JES.evaluate(obj, { $set: 'new' });
        //console.log(typeof transformed)
        transformed.should.be.eql('new');
    });

    it('array', function () {
        let array = [1, 2, 3];

        let transformed = JES.evaluate(array, { $set: 'new' });
        //console.log(typeof transformed)
        transformed.should.be.eql('new');
    });

    it('num', function () {
        let num = 1;

        let transformed = JES.evaluate(num, { $set: 'new' });
        //console.log(typeof transformed)
        transformed.should.be.eql('new');
    });
});

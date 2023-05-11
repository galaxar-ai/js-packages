import JES from '../../lib';

describe('transformer:size', function () {
    it('obj', function () {
        let obj = {
            id: 1,
            user: 100,
            agency: 1,
        };

        let transformed = JES.evaluate(obj, '$size');
        //console.log(transformed)
        transformed.should.be.eql(3);
    });

    it('array', function () {
        let array = [1, 2, 3];

        let transformed = JES.evaluate(array, '$size');
        //console.log(transformed)
        transformed.should.be.eql(3);
    });

    it('str', function () {
        let str = 'abcd';

        let transformed = JES.evaluate(str, '$size');
        //console.log(transformed)
        transformed.should.be.eql(4);
    });
});

import JES from '../../lib';

describe('transformer:at', function () {

    it('array', function () {
        let array = [1,2,3];
        
        let transformed = JES.evaluate(array, {'$at' : 0});
        //console.log(transformed)
        transformed.should.be.eql(
            1
        );

        transformed = JES.evaluate(array, {'$at' : -1});
        //console.log(transformed)
        transformed.should.be.eql(
            3
        );
    });
});

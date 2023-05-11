import JES from '../../lib';

describe('transformer:split', function () {   

    it('split 1', function () {
        let array = 'a,b,c';

        JES.evaluate(array, { $split: ',' }).should.be.eql(['a', 'b', 'c']);
    });

    it('split 2', function () {
        let array = 'a,b,c';

        JES.evaluate(array, { $split: [ ',' , 2 ]}).should.be.eql(['a', 'b']);
    });
});

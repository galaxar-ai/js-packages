import JES from '../../lib';

describe('jes:bugs', function () {   
    it('bug - match context', function () {
        const obj = {
            maxIndex: 3,
            index: 2
        };

        const result = JES.evaluate(obj, [{
            $valueOf: 'index'
        },
            {
            $match: '$$ROOT.maxIndex'
        }]);
        
        result.should.not.be.ok();

        const obj2 = {
            maxIndex: 3,
            index: 3
        };

        const result2 = JES.evaluate(obj2, [{
            $valueOf: 'index'
        },
            {
            $match: '$$ROOT.maxIndex'
        }]);
        
        result2.should.be.ok();
    } );
});

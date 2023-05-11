import JES from '../../lib';

describe('transform:remap', function () {
 
    it('obj', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };
        
        let transformed = JES.evaluate(obj, {'$remap':{user:'username'}});
        //console.log(transformed)
        transformed.should.be.eql(
            { username: 100 }
  
        );
    });

    it('array', function () {
        let array = [{
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        }];
        
        let transformed = JES.evaluate(array, {'|>$remap':{user:'username'}});
        //console.log(transformed)
        transformed.should.be.eql(
            [{ username: 100 }]
  
        );
    });




});

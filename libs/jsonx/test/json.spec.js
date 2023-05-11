import Jxs from '../lib';

describe('transformer:json', function () {
    it('obj', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = Jxs.evaluate(obj, '$json');
        //console.log(transformed)

        transformed.should.be.eql(
            '{"id":1,"user":100,"agency":1,":user":{"email":"email1","other":"any"},":agency":{"name":"agency1","other":"any"}}'
        );
    });

    it('array', function () {
        let array = [1, 2, 3];

        let transformed = Jxs.evaluate(array, '$json');
        //console.log(transformed)

        transformed.should.be.eql('[1,2,3]');
    });

    it('num', function () {
        let num = 1;

        let transformed = Jxs.evaluate(num, '$json');
        transformed.should.be.eql('1');
    });

    it('json', function () {
        let json = '{"one": 1}';
        
        let transformed = Jxs.evaluate(json, '$object');
        //console.log(transformed)
        transformed.should.be.eql(
            {one :1}
        );
    });
});

import Jxs from '../lib';

describe('transformer:filterNull', function () {   

    it('bvt', function () {
        let obj = {
            a: 10,
            b: null,
            c: 30,
        }

        Jxs.evaluate(obj, '$filterNull').should.be.eql({
            a: 10,
            c: 30,
        });
    });
});

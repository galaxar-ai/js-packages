import JES from '../../lib';
import '../locale/msg.en-US';

describe('jes:validator', function () {
    it('equal', function () {
        let obj = {
            key1: 2000,
            key2: 'ok',
            key3: {
                key1: 20,
                key2: 'ok',
            },
            key4: null,
            key5: false,
            key6: true,
        };

        JES.match(obj, {
            key1: 2000,
            key2: 'ok',
            key3: {
                key1: 20,
                key2: 'ok',
            },
            key4: null,
            key5: false,
            key6: true,
        }).should.be.eql([true]);

        let result = JES.match(obj, {
            key1: 2001,
        });
        result[0].should.not.be.ok();
        result[1].should.be.match(/ must be 2001/);

        result = JES.match(obj, {
            key2: 'ng',
        });
        result[0].should.not.be.ok();
        result[1].should.be.match(/ must be "ng"/);
    });

    it('equal2', function () {
        let obj = {
            key1: [1, 2, 3],
            key2: [1],
        };

        JES.match(obj, {
            key1: [1, 2, 3],
            key2: [1],
        })[0].should.be.ok();

        const result = JES.match(obj, {
            key1: [1, 2],
            key2: [1, 3],
        });
        console.log(result);

        result[0].should.be.not.ok();

        JES.match(obj, {
            key1: [1, 2],
            key2: [1],
        })[0].should.be.not.ok();
    });

    it('required', function () {
        let obj = {
            a: 10,
            b: 20
        };

        JES.match(obj, {
            a: { $required: true },
            c: { $required: false },
        }).should.be.eql([true]);

        JES.match(obj, {
            c: { $required: true },
        }).should.be.eql([false, 'c is required.']);
    });

    it('mixed', function () {
        var c = { a: { b: 10 } };
        let obj = {
            key1: 2000,
            key11: 2000,
            key12: 2000,
            key13: 2000,

            key2: 'ok',
            key21: 'ok',
            key22: 'ok',
            key23: 'ok',
            key24: 'ok',
            key25: 1,

            key3: {
                key1: 20,
                key2: 'ok',
            },
            key4: null,
            key5: false,
            key6: true,
            key8: c,
        };

        JES.match(obj, {
            key1: { $gt: 1000 },
            key11: { $gte: 2000 },
            key12: { $lt: 3000 },
            key13: { $lte: 2000 },

            key2: { $eq: 'ok' },
            key21: { $neq: 'ng' },

            key22: { $in: ['ok', 'ng'] },
            key23: { $nin: ['ng1', 'ng2'] },
            key24: { $nin: null },
            key25: { $nin: null },

            key4: { $exists: false },
        }).should.be.eql([true]);

        JES.match(obj, {
            key1: { $hasKey: c.a.b },
        }).should.be.eql([false, 'key1 must have all of these keys [10].']);

        JES.match(obj, {
            key8: { $hasKey: [10] },
        }).should.be.eql([false, 'key8 must have all of these keys [10].']);
    });

    it('jes', function () {
        //var c = {a:{b:10}};
        let obj = {
            key1: 2000,
            key11: 2000,
            key12: 2000,
            key13: 2000,

            key2: 'ok',
            key21: 'ok',
            key22: 'ok',
            key23: 'ok',

            key3: {
                key1: 20,
                key2: 'ok',
            },
            key4: null,
            key5: false,
            key6: true,
            key7: [1, 2, 3],
            //key8: c,
        };

        const jeso = new JES(obj);
        jeso.match({
            key1: { $gt: 1000 },
            key11: { $gte: 2000 },
            key12: { $lt: 3000 },
            key13: { $lte: 2000 },
        })
            .match({
                key2: { $eq: 'ok' },
                key21: { $neq: 'ng' },

                key22: { $in: ['ok', 'ng'] },
                key23: { $nin: ['ng1', 'ng2'] },

                key4: { $exists: false },
                key2: { $is: 'string' },
                key7: { $is: 'array' },
                key1: { $is: 'integer' },
            })
            .match({
                key3: {
                    key1: 20,
                    key2: {
                        $neq: 'ng',
                    },
                },
            });

        jeso.match({
            key1: { $is: 'integer' },
        });

        should.throws(() => {
            jeso.match({
                key1: { $is: 'string' },
            });
        }, 'The value of key1 must be a(n) "text"');

        should.throws(() => {
            jeso.match({
                key4: { $exists: true },
            });
        }, 'The right operand of a "Not Null" operator must be a boolean value.');

        should.throws(() => {
            jeso.match({
                key1: { $in: 3000 },
            });
        }, 'The right operand of a "In" operator must be an array.');

        should.throws(() => {
            jeso.match({
                key1: { $nin: 3000 },
            });
        }, 'The right operand of a "Not In" operator must be an array.');

        should.throws(() => {
            jeso.match({
                key1: { $gt: 3000 },
            });
        }, /key1 must be greater than 3000/);

        should.throws(() => {
            jeso.match({
                key1: { $lt: 1000 },
            });
        }, /key1 must be less than 1000/);

        should.throws(() => {
            jeso.match({
                key1: { $in: [100, 200] },
            });
        }, 'ValidationError: "key1" should be one of [100,200].');

        should.throws(() => {
            jeso.match({
                key1: { $nin: [1000, 2000] },
            });
        }, 'ValidationError: "key1" should not be any one of [1000,2000].');

        should.throws(() => {
            jeso.match({
                key99: { $exist: true },
            });
        }, 'ValidationError: "key99" should not be NULL.');

        should.throws(() => {
            jeso.match({
                key1: { $exist: false },
            });
        }, 'ValidationError: "key1" should be NULL.');

        should.throws(() => {
            jeso.match({
                key1: { $is: 'string' },
            });
        }, 'ValidationError: The type of "key1" should be "string".');

        should.throws(() => {
            jeso.match({
                key3: { key2: 'ng' },
            });
        }, 'ValidationError: "key3.key2" should be "ng".');
    });

    it('eval not array', function () {
        let obj = {
            key1: 2000,
        };

        let jeso = new JES(obj);

        should.throws(() => {
            jeso.match({
                $eval: 2000,
            });
        }, 'InvalidArgument: The operand of a "OP_MATCH_ANY" operator must be an array.');
    });

    it('any', function () {
        let obj = {
            key1: 2000,
            key11: 2000,
            key12: 2000,
            key13: 2000,
        };

        let jeso = new JES(obj);

        jeso.match({
            $any: [{ key1: 3000 }, { key11: 2000 }],
        });

        should.throws(() => {
            jeso.match({
                $any: [{ key1: 3000 }, { key11: 3000 }],
            });
        }, /The value does not match any of given criterias/);

        should.throws(() => {
            jeso.match({
                $any: { key1: 3000 },
            });
        }, 'InvalidArgument: The operand of a "OP_MATCH_ANY" operator must be an array.');
    });

    it('all match', function () {
        let objs = [ 1000, 2320, 2333, 4567 ];

        JES.match(objs, {
            '|>$all': { $gte: 1000 }
        }).should.be.eql([true]);

        JES.match(objs, {
            '|>$all': { $gt: 2000 }
        }).should.be.eql([false, [
            'One of the element of the value does not match the requirement(s).',
            'The value must be greater than 2000.'
          ]]);        
    });
    it('should', function () {
        let obj = {
            key1: 123,
            key2: 456,
        };

        JES.match(obj, {
            key1: { $should: { $eq: 123 } },
            key2: { $should: { $eq: 456 } },
        }).should.be.eql([true]);
    });
    it('any match', function () {
        let array = [1, 2, 3, 4, -1];

        let matched = JES.match(array, {
            '|*$match': { $lt: 0 },
        });
        matched.should.be.eql([true]);

        let matched3 = JES.match(array, {
            '|*$match': { $gt: 10 },
        });

        matched3.should.be.eql([false, "None of the element of the value matches the requirement(s)."]);

    });
});

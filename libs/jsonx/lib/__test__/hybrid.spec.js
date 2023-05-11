import JES from '../../lib';

describe('transformer:hybrid', function () {
    it('eval', function () {
        let obj = {
            key1: 2000,
            key11: 2000,
            key12: 2000,
            key13: 2000,
        };

        let jeso = new JES(obj);

        const pipelined = jeso.evaluate([
            {
                '|>$add': 100,
            },
            {
                '|>$subtract': 200,
            },
            '$sum',
        ]);

        pipelined.should.be.exactly(7600);
        jeso.value.should.be.eql(obj);

        jeso.update({
            key1: {
                $add: 100,
            },
            key11: {
                $subtract: 100,
            },
            key12: {
                $multiply: 100,
            },
            key13: {
                $divide: 100,
            },
        }).value.should.be.eql({
            key1: 2100,
            key11: 1900,
            key12: 200000,
            key13: 20,
        });

        jeso.update([
            '$sum',
            {
                $add: 1,
            },
        ]).value.should.be.exactly(204021);
    });

    it('eval array', function () {
        let obj = {
            keep: 'keep',
            items: [
                { name: 'Jack', score: 60 },
                { name: 'Bob', score: 40 },
                { name: 'Jane', score: 80 },
                { name: 'Peter', score: 100 },
            ],
            ignored: 'ingored',
            exlcluded: 'exlcluded',
        };

        let jeso = new JES(obj);

        const pipelined = jeso.evaluate({
            keep: true,
            excluded: false,
            newItem: { $set: 'new' },
            highestScore: [
                '$$PARENT.items',
                {
                    $sortBy: 'score',
                },
                '$reverse',
                {
                    $nth: 0,
                },
                {
                    $of: 'score',
                },
            ],
        });

        should.exist(pipelined.keep);
        should.exist(pipelined.newItem);
        should.exist(pipelined.highestScore);
        should.not.exist(pipelined.exlcluded);
        should.not.exist(pipelined.items);
        should.not.exist(pipelined.ignored);

        pipelined.newItem.should.be.exactly('new');
        pipelined.highestScore.should.be.exactly(100);
    });

    it('keys-values-entries', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = JES.evaluate(obj, '$keys');
        transformed.should.be.eql(['id', 'user', 'agency', ':user', ':agency']);

        transformed = JES.evaluate(obj, '$values');
        transformed.should.be.eql([
            1,
            100,
            1,
            { email: 'email1', other: 'any' },
            { name: 'agency1', other: 'any' },
        ]);

        transformed = JES.evaluate(obj, [
            '$toArray',
            { '|>$remap': { k: 'category', v: 'item' } },
        ]);
        transformed.should.be.eql([
            { category: 'id', item: 1 },
            { category: 'user', item: 100 },
            { category: 'agency', item: 1 },
            { category: ':user', item: { email: 'email1', other: 'any' } },
            { category: ':agency', item: { name: 'agency1', other: 'any' } },
        ]);
    });

    it('transform collection', function () {
        let array = [
            {
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'user': 101,
                'agency': 1,
                ':user': { email: 'email2', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'user': 102,
                'agency': 1,
                ':user': { email: 'email3', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'user': 103,
                'agency': 2,
                ':user': { email: 'email4', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
            {
                'user': 104,
                'agency': 2,
                ':user': { email: 'email5', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
        ];

        let transformed = JES.evaluate(array, {
            '|>$apply': {
                user: ['$$PARENT.:user', { $pick: ['email'] }],
                agency: ['$$PARENT.:agency', { $pick: ['name'] }],
            },
        });

        transformed.should.be.eql([
            { user: { email: 'email1' }, agency: { name: 'agency1' } },
            { user: { email: 'email2' }, agency: { name: 'agency1' } },
            { user: { email: 'email3' }, agency: { name: 'agency1' } },
            { user: { email: 'email4' }, agency: { name: 'agency2' } },
            { user: { email: 'email5' }, agency: { name: 'agency2' } },
        ]);
    });

    it('startwith not string', function () {
        let array = [
            {
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
        ];
        let array_error = [
            {
                undeclaredVariable: '100',
                2111111111111111: '1',
                3111111111111111: '2',
                4111111111111111: '3',
            },
        ];
        const jeso_error = new JES(array_error);
        let transformed1 = JES.evaluate(array_error, {
            '|>$apply': {
                $pick: {
                    $not: {
                        $startWith: ':',
                    },
                },
            },
        });

        const jeso = new JES(array);
        should.throws(function () {
            jeso.evaluate({
                $merge: 1,
            });
        }, 'The right operand of a "OP_MERGE" operator must be an array.');

        let transformed = JES.evaluate(array, {
            '|>$apply': {
                $merge: [
                    {
                        $pick: {
                            $not: {
                                $endWith: ':',
                            },
                        },
                    },
                    {
                        '@user': ['$$PARENT.:user', { $pick: ['email'] }],
                        '@agency': ['$$PARENT.:agency', { $pick: ['name'] }],
                    },
                ],
            },
        });

        should.throws(() => {
            let transformed = JES.evaluate(array, {
                '|>$apply': {
                    $merge: [
                        {
                            $pick: {
                                $not: {
                                    $endWith: 1,
                                },
                            },
                        },
                        {
                            '@user': ['$$PARENT.:user', { $pick: ['email'] }],
                            '@agency': [
                                '$$PARENT.:agency',
                                { $pick: ['name'] },
                            ],
                        },
                    ],
                },
            });
        }, 'AssertionError: Missing expected exception. InvalidArgument: Invalid validation operator "$add".');
        transformed.should.be.eql([
            {
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
                '@user': { email: 'email1' },
                '@agency': { name: 'agency1' },
            },
        ]);
    });

    it('group', function () {
        let array = [1];

        let grouped = JES.evaluate(array, {
            '|>$apply': {
                $group: [4],
            },
        });

        grouped.should.be.eql([{}]);
    });

    it('transform collection - merge', function () {
        let array = [
            {
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'user': 101,
                'agency': 1,
                ':user': { email: 'email2', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'user': 102,
                'agency': 1,
                ':user': { email: 'email3', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'user': 103,
                'agency': 2,
                ':user': { email: 'email4', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
            {
                'user': 104,
                'agency': 2,
                ':user': { email: 'email5', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
        ];

        let transformed = JES.evaluate(array, {
            '|>$apply': {
                $merge: [
                    {
                        $pick: {
                            $not: {
                                $startWith: ':',
                            },
                        },
                    },
                    {
                        '@user': ['$$PARENT.:user', { $pick: ['email'] }],
                        '@agency': ['$$PARENT.:agency', { $pick: ['name'] }],
                    },
                ],
            },
        });

        transformed.should.be.eql([
            {
                'user': 100,
                'agency': 1,
                '@user': { email: 'email1' },
                '@agency': { name: 'agency1' },
            },
            {
                'user': 101,
                'agency': 1,
                '@user': { email: 'email2' },
                '@agency': { name: 'agency1' },
            },
            {
                'user': 102,
                'agency': 1,
                '@user': { email: 'email3' },
                '@agency': { name: 'agency1' },
            },
            {
                'user': 103,
                'agency': 2,
                '@user': { email: 'email4' },
                '@agency': { name: 'agency2' },
            },
            {
                'user': 104,
                'agency': 2,
                '@user': { email: 'email5' },
                '@agency': { name: 'agency2' },
            },
        ]);
    });

    it('additem', function () {
        let array = [1];

        should.throws(() => {
            let transformed = JES.evaluate(array, {
                '|>$apply': [
                    {
                        $addItem: ['$test', '$$CURRENT.id'],
                    },
                ],
            });
        }, 'The value to take a "Add K-V Entry" operator must be either an object or an array.');
    });

    it('omit', function () {
        let array = [
            {
                id: 1,
                user: 100,
                agency: 1,
            },
        ];
        should.throws(() => {
            let transformed = JES.evaluate(array, {
                '|>$apply': [
                    {
                        $pooo: 1,
                    },
                ],
            });
        }, 'AssertionError: Missing expected exception. AssertionError: Missing expected exception. AssertionError: Missing expected exception. InvalidArgument: Invalid validation operator "$add".');

        should.throws(() => {
            let transformed = JES.evaluate(array, {
                '|>$apply': [
                    {
                        '|>$pooooo': 1,
                    },
                ],
            });
        }, 'AssertionError: Missing expected exception. AssertionError: Missing expected exception. AssertionError: Missing expected exception. InvalidArgument: Invalid validation operator "$add".');

        let transformed = JES.evaluate(array, {
            '|>$apply': [
                {
                    $omit: 1,
                },
            ],
        });

        transformed.should.be.eql([{ user: 100, id: 1, agency: 1 }]);
    });

    it('pick & omit by jes', function () {
        let array = [
            {
                'id': 1,
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 2,
                'user': 101,
                'agency': 1,
                ':user': { email: 'email2', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 3,
                'user': 102,
                'agency': 1,
                ':user': { email: 'email3', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 4,
                'user': 103,
                'agency': 2,
                ':user': { email: 'email4', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
            {
                'id': 5,
                'user': 104,
                'agency': 2,
                ':user': { email: 'email5', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
        ];

        should.throws(() => {
            let transformed = JES.evaluate(array, {
                '|>$apply': [
                    {
                        $pick: {
                            $not: {
                                $startWith: ':',
                            },
                        },
                    },
                    {
                        $addItem: ['$test', '$$CURRENT.id', 'aaa'],
                    },
                    {
                        $omit: ['id'],
                    },
                ],
            });
        }, 'AssertionError: Missing expected exception. AssertionError: Missing expected exception. AssertionError: Missing expected exception. InvalidArgument: Invalid validation operator "$add".');

        let transformed = JES.evaluate(array, {
            '|>$apply': [
                {
                    $pick: {
                        $not: {
                            $startWith: ':',
                        },
                    },
                },
                {
                    $addItem: ['$test', '$$CURRENT.id'],
                },
                {
                    $omit: ['id'],
                },
            ],
        });

        should.throws(() => {
            let picked_left = JES.evaluate(array, {
                '|>$apply': [
                    {
                        $pick: {
                            $not: {
                                $startWith: 1,
                            },
                        },
                    },
                ],
            });
        }, 'AssertionError: Missing expected exception. InvalidArgument: Invalid validation operator "$add".');

        transformed.should.be.eql([
            { user: 100, agency: 1, $test: 1 },
            { user: 101, agency: 1, $test: 2 },
            { user: 102, agency: 1, $test: 3 },
            { user: 103, agency: 2, $test: 4 },
            { user: 104, agency: 2, $test: 5 },
        ]);
    });

    it('filter', function () {
        let array = [
            {
                'id': 1,
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 2,
                'user': 101,
                'agency': 1,
                ':user': { email: 'email2', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 3,
                'user': 102,
                'agency': 1,
                ':user': { email: 'email3', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 4,
                'user': 103,
                'agency': 2,
                ':user': { email: 'email4', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
            {
                'id': 5,
                'user': 104,
                'agency': 2,
                ':user': { email: 'email5', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
        ];

        let transformed = JES.evaluate(array, [
            {
                $select: {
                    user: {
                        $gte: 102,
                    },
                },
            },
            {
                '|>$omit': {
                    $startWith: ':',
                },
            },
        ]);

        transformed.should.be.eql([
            { id: 3, user: 102, agency: 1 },
            { id: 4, user: 103, agency: 2 },
            { id: 5, user: 104, agency: 2 },
        ]);
    });

    it('remap', function () {
        let array = [
            {
                'id': 1,
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 2,
                'user': 101,
                'agency': 1,
                ':user': { email: 'email2', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 3,
                'user': 102,
                'agency': 1,
                ':user': { email: 'email3', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
            {
                'id': 4,
                'user': 103,
                'agency': 2,
                ':user': { email: 'email4', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
            {
                'id': 5,
                'user': 104,
                'agency': 2,
                ':user': { email: 'email5', other: 'any' },
                ':agency': { name: 'agency2', other: 'any' },
            },
        ];

        let transformed = JES.evaluate(array, [
            {
                $select: {
                    user: {
                        $gte: 102,
                    },
                },
            },
            {
                '|>$omit': {
                    $startWith: ':',
                },
            },
            {
                '|>$remap': {
                    user: 'username',
                },
            },
        ]);

        transformed.should.be.eql([
            { username: 102 },
            { username: 103 },
            { username: 104 },
        ]);
    });

    it('remap keep unmapped', function () {
        let array = [
            {
                id: 1,
                user: 100,
            },
            {
                id: 2,
                user: 101,
            },
        ];

        let transformed = JES.evaluate(array, [
            {
                '|>$remap': [
                    {
                        user: 'username',
                    },
                    true,
                ],
            },
        ]);

        transformed.should.be.eql([
            { id: 1, username: 100 },
            { id: 2, username: 101 },
        ]);
    });

    it('if', function () {
        let obj = {
            key1: 1.11,
        };

        const jeso = new JES(obj);

        jeso.evaluate({
            $if: [
                { key1:  { $match: { $gt: 0 } } },
                { $set: 'positive' },
                { $set: 'non-positive' },
            ],
        }).match('positive');

        jeso.evaluate({
            $if: [
                { key1: { $match: { $gt: 2 } } },
                { $set: 'positive' },
                { $set: 'non-positive' },
            ],
        }).match('non-positive');

        should.throws(function () {
            jeso.evaluate({
                $if: { key1: { $match: { $gt: 0 } } },
            });
        }, 'The right operand of a "If Else" operator must be an array.');

        should.throws(function () {
            jeso.evaluate({
                $if: [
                    { key1: { $match: { $gt: 0 } } },
                    { $set: 'positive' },
                    { $set: 'non-positive' },
                    { key1: { $lt: 2 } },
                ],
            });
        }, 'The right operand of a "If Else" operator must be either a 2-tuple or a 3-tuple.');
    });
    it('pick', function () {
        let array = null;

        should.throws(function () {
            let picked_left = JES.evaluate(a, {
                '|>$apply': [
                    {
                        $pick: {
                            $not: {
                                $startWith: 'u',
                            },
                        },
                    },
                ],
            });
        }, 'ReferenceError: array is not defined');
        let picked_left = JES.evaluate(array, {
            '|>$apply': [
                {
                    $pick: {
                        $not: {
                            $startWith: 'u',
                        },
                    },
                },
            ],
        });

        let array1 = [
            {
                'user': 100,
                'agency': 1,
                ':user': { email: 'email1', other: 'any' },
                ':agency': { name: 'agency1', other: 'any' },
            },
        ];
        picked_left.should.be.eql({});
        let picked_right = JES.evaluate(array1, {
            '|>$apply': [
                {
                    $pick: 1,
                },
            ],
        });
        picked_left.should.be.eql({});
    });

    it('assign', function () {
        let obj = {
            'id': 1,
            'user': 100,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        };

        let transformed = JES.evaluate(obj, [
            {
                $assign: {
                    user: {
                        $add: 200,
                    },
                },
            },
        ]);

        transformed.should.be.eql({
            'id': 1,
            'user': 300,
            'agency': 1,
            ':user': { email: 'email1', other: 'any' },
            ':agency': { name: 'agency1', other: 'any' },
        });
    });
});

import { startWorker } from '@galaxar/app';

describe('prisma', function () {
    it('bvt', async function () {
        await startWorker(
            async (app) => {
                const prisma = app.getService('prisma');
                await prisma.user.deleteMany();
                const created = await prisma.user.create({
                    data: {
                        email: 'test@email.com',
                        name: 'test',
                    },
                });

                const found = await prisma.user.findUnique({
                    where: {
                        id: created.id,
                    },
                });

                found.should.be.eql(created);
            },
            {
                workingPath: 'test',
            }
        );
    });

    it('pushQuery', async function () {
        await startWorker(
            async (app) => {
                const prisma = app.getService('prisma');
                await prisma.user.deleteMany();
                const created1 = await prisma.user.create({
                    data: {
                        email: 'test@email.com',
                        name: 'test',
                        category: 'cat1',
                    },
                });

                const created2 = await prisma.user.create({
                    data: {
                        email: 'test2@email.com',
                        name: 'test2',
                        category: 'cat1',
                    },
                });

                const created3 = await prisma.user.create({
                    data: {
                        email: 'test3@email.com',
                        name: 'test',
                        category: 'cat2',
                    },
                });

                const where = {
                    category: 'cat1',
                };

                const where1 = prisma.$pushQuery(where, { name: 'test' });

                const found1 = await prisma.user.findMany({
                    where: where1,
                });

                where.should.be.eql({
                    category: 'cat1',
                });
                found1.length.should.be.eql(1);

                const where2 = prisma.$pushOrQuery(where1, { category: 'cat2' });

                where1.should.be.eql({ category: 'cat1', name: 'test' });

                const found2 = await prisma.user.findMany({
                    where: where2,
                });

                found2.length.should.be.eql(2);

                const where3 = {
                    name: {
                        contains: 'test',
                    },
                };

                const _where3 = prisma.$pushQuery(where3, { name: { not: 'test' } });

                const found3 = await prisma.user.findMany({
                    where: _where3,
                });

                _where3.should.be.eql({
                    AND: [
                        {
                            name: {
                                contains: 'test',
                            },
                        },
                        {
                            name: {
                                not: 'test',
                            },
                        },
                    ],
                });
                found3.length.should.be.eql(1);
            },
            {
                workingPath: 'test',
                logLevel: 'debug',
            }
        );
    });

    it('model', async function () {
        await startWorker(
            async (app) => {
                const prisma = app.getService('prisma');
                const User = prisma.$model('user');

                await User.upsert({
                    email: 'test999@email.com',
                    name: 'test999',                
                });

                await User.upsert({
                    email: 'test999@email.com',
                    name: 'test1000',                
                });

                const found = await User.findUnique({
                    where: { email: 'test999@email.com', },
                });

                found.name.should.be.eql('test1000');
            },
            {
                workingPath: 'test',
            }
        );
    });
});

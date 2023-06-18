import { Controller } from '@galaxar/server';
import { Types } from '@galaxar/types';

class UserController extends Controller {
    async find(ctx) {
        const prisma = ctx.appModule.getService('prisma');

        const users = await prisma.user.findMany({});

        this.send(ctx, users);
    }

    async findById(ctx, userId) {
        userId = Types.INTEGER.sanitize(userId);

        const prisma = ctx.appModule.getService('prisma');

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        this.send(ctx, user);
    }

    async post(ctx) {
        const input = Types.OBJECT.sanitize(ctx.request.body, {
            schema: {
                email: { type: 'text' },
                name: { type: 'text', optional: true },
            },
        });

        const prisma = ctx.appModule.getService('prisma');

        const user = await prisma.user.create({
            data: input,
        });

        this.send(ctx, user);
    }

    async updateById(ctx, userId) {
        userId = Types.INTEGER.sanitize(userId);

        const input = Types.OBJECT.sanitize(ctx.request.body, {
            schema: {
                email: { type: 'text', optional: true },
                name: { type: 'text', optional: true },
            },
        });

        const prisma = ctx.appModule.getService('prisma');

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: input,
        });

        this.send(ctx, user);
    }

    async deleteById(ctx, userId) {
        userId = Types.INTEGER.sanitize(userId);

        const prisma = ctx.appModule.getService('prisma');

        const user = await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        this.send(ctx, user);
    }
}

export default UserController;

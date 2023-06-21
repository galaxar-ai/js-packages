class User {
    constructor(prisma) {
        this.model = prisma.user;
    }

    async upsert_(input) {
        const { email, ...others } = input;

        return this.model.upsert({
            where: { email },
            create: input,
            update: others,
        });
    }
}

export default User;
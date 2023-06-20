class User {
    constructor(prisma) {
        this.model = prisma.user;
    }

    async upsert(input) {
        const { email, ...others } = input;

        return this.model.upsert({
            where: { email },
            create: input,
            update: others,
        });
    }
}

export default User;
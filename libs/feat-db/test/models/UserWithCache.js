class User {
    constructor(prisma) {
        this.model = prisma.user;
        prisma.$setupCache(this, {
            'list': { where: {}, type: 'list' },
            'map': { where: {}, type: 'map', mapByKey: 'email' },
        });
    }
}

export default User;
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _app = require("@galaxar/app");
const _utils = require("@galaxar/utils");
const _client = require("@prisma/client");
const prismsHelper = {
    $pushQuery: (where, query)=>{
        let { AND , ..._where } = where;
        _utils._.each(query, (value, key)=>{
            const existing = _where[key];
            if (typeof existing !== 'undefined') {
                if (!AND) {
                    AND = [];
                } else {
                    AND = [
                        ...AND
                    ];
                }
                delete _where[key];
                AND.push({
                    [key]: existing
                });
                AND.push({
                    [key]: value
                });
            } else {
                _where[key] = value;
            }
        });
        if (AND) {
            _where.AND = AND;
        }
        return _where;
    },
    $pushOrQuery: (where, query)=>{
        if (!where.OR) {
            where = {
                OR: [
                    where
                ]
            };
        } else {
            where = {
                OR: [
                    ...where.OR
                ]
            };
        }
        where.OR.push(query);
        return where;
    }
};
const _default = {
    stage: _app.Feature.SERVICE,
    groupable: true,
    load_: async function(app, options, name) {
        const prisma = new _client.PrismaClient(options);
        await prisma.$connect();
        app.on('stopping', async ()=>{
            await prisma.$disconnect();
        });
        Object.assign(prisma, prismsHelper);
        app.registerService(name, prisma);
    }
};

//# sourceMappingURL=prisma.js.map
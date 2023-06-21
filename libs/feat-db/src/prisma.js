import path from 'node:path';
import { Feature } from '@galaxar/app';
import { _, esmCheck, pascalCase, unexistDelegate } from '@galaxar/utils';
import { PrismaClient } from '@prisma/client';

const prismsHelper = {
    $pushQuery: (where, query) => {
        let { AND, ..._where } = where;

        _.each(query, (value, key) => {
            const existing = _where[key];
            if (typeof existing !== 'undefined') {
                if (!AND) {
                    AND = [];
                } else {
                    AND = [...AND];
                }

                delete _where[key];
                AND.push({ [key]: existing });
                AND.push({
                    [key]: value,
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
    $pushOrQuery: (where, query) => {
        if (!where.OR) {
            where = {
                OR: [where],
            };
        } else {
            where = {
                OR: [...where.OR],
            };
        }

        where.OR.push(query);
        return where;
    },
};

export default {
    stage: Feature.SERVICE,

    groupable: true,

    load_: async function (app, options, name) {
        const { modelPath, ...prismaOptions } = app.featureConfig(
            options,
            {
                schema: {
                    modelPath: { type: 'string', default: 'models' },
                    datasources: { type: 'object', optional: true },
                    log: { type: 'array', elementSchema: { type: 'text' }, optional: true },
                },
            },
            name
        );

        const _modelPath = path.join(app.sourcePath, modelPath);
        const modelCache = new Map();

        const prisma = new PrismaClient(prismaOptions);

        await prisma.$connect();

        app.on('stopping', async () => {
            await prisma.$disconnect();
        });

        Object.assign(prisma, prismsHelper);

        const modelDelegate = (target, prop) => {
            return target.model[prop];
        }

        prisma.$model = (name) => {
            name = name.toLowerCase();
            let modelObject = modelCache.get(name);
            if (!modelObject) {                
                const Model = esmCheck(require(path.join(_modelPath, pascalCase(name))));
                modelObject = unexistDelegate(new Model(prisma, app), modelDelegate, true);
                modelCache.set(name, modelObject);
            }
            return modelObject;
        };

        app.registerService(name, prisma);
    },
};

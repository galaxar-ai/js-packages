import path from 'node:path';
import { Feature } from '@galaxar/app';
import { _, esmCheck, pascalCase, unexistDelegate } from '@galaxar/utils';
import { InvalidArgument, ApplicationError } from '@galaxar/types';
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

const symCache = Symbol('cache'); 

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
        };

        prisma.$model = (name) => {
            const _name = name.toLowerCase();
            let modelObject = modelCache.get(_name);
            if (!modelObject) {
                const Model = esmCheck(require(path.join(_modelPath, pascalCase(name))));
                modelObject = unexistDelegate(new Model(prisma, app), modelDelegate, true);
                modelCache.set(_name, modelObject);
            }
            return modelObject;
        };

        prisma.$setupCache = (modelBox, entries) => {
            if (!modelBox.model) {
                throw new ApplicationError(
                    'prisma.$setupCache should be called in the constructor and after model is assigned.'
                );
            }

            modelBox[symCache] = new Map();

            modelBox.cache_ = async (key) => {
                let cache = modelBox[symCache].get(key);
                if (cache) {
                    return cache;
                }

                const meta = entries[key];
                if (!meta) {
                    throw new InvalidArgument(`No cache setup for key: ${key}`);
                }

                const { where = {}, type = 'list', mapByKey } = meta;

                let data = await modelBox.model.findMany({
                    where,
                });

                if (type === 'map') {
                    if (!mapByKey) {
                        throw new InvalidArgument(`No "mapByKey" set for map type cache: ${key}`);
                    }

                    data = data.reduce((result, item) => {
                        result[item[mapByKey]] = item;
                        return result;
                    }, {});
                } // else type === 'list'

                modelBox[symCache].set(key, data);
                return data;
            };

            modelBox.resetCache = (key) => {
                modelBox[symCache].delete(key);
            };
        };

        app.registerService(name, prisma);
    },
};

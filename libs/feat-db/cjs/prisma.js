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
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _app = require("@galaxar/app");
const _utils = require("@galaxar/utils");
const _client = require("@prisma/client");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
        const { modelPath , ...prismaOptions } = app.featureConfig(options, {
            schema: {
                modelPath: {
                    type: 'string',
                    default: 'models'
                },
                datasources: {
                    type: 'object',
                    optional: true
                },
                log: {
                    type: 'array',
                    elementSchema: {
                        type: 'text'
                    },
                    optional: true
                }
            }
        }, name);
        const _modelPath = _nodepath.default.join(app.sourcePath, modelPath);
        const modelCache = new Map();
        const prisma = new _client.PrismaClient(prismaOptions);
        await prisma.$connect();
        app.on('stopping', async ()=>{
            await prisma.$disconnect();
        });
        Object.assign(prisma, prismsHelper);
        const modelDelegate = (target, prop)=>{
            return target.model[prop];
        };
        prisma.$model = (name)=>{
            name = name.toLowerCase();
            let modelObject = modelCache.get(name);
            if (!modelObject) {
                const Model = (0, _utils.esmCheck)(require(_nodepath.default.join(_modelPath, (0, _utils.pascalCase)(name))));
                modelObject = (0, _utils.unexistDelegate)(new Model(prisma), modelDelegate, true);
                modelCache.set(name, modelObject);
            }
            return modelObject;
        };
        app.registerService(name, prisma);
    }
};

//# sourceMappingURL=prisma.js.map
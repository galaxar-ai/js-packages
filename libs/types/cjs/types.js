"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Types: function() {
        return Types;
    },
    Primitives: function() {
        return Primitives;
    },
    addType: function() {
        return addType;
    },
    callType: function() {
        return callType;
    },
    sanitize: function() {
        return sanitize;
    },
    serialize: function() {
        return serialize;
    }
});
const _errors = require("./errors");
const Types = {};
const Primitives = new Set();
const addType = (name, typeMeta)=>{
    if (name in Types) {
        throw new Error(`Type "${name}" already exist.`);
    }
    Types[name] = typeMeta;
    Primitives.add(name);
    typeMeta.alias?.forEach((a)=>{
        Types[a] = typeMeta;
        Primitives.add(a);
    });
};
const callType = (method)=>(value, typeInfo, i18n, fieldPath)=>{
        if (!Primitives.has(typeInfo.type)) {
            throw new _errors.InvalidArgument(`Unsuppported primitive type: "${typeInfo.type}"."`);
        }
        const typeObject = Types[typeInfo.type];
        return typeObject[method](value, typeInfo, i18n, fieldPath);
    };
const sanitize = callType("sanitize");
const serialize = callType("serialize");

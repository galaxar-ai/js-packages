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
    Plugins: function() {
        return Plugins;
    },
    addType: function() {
        return addType;
    },
    addPlugin: function() {
        return addPlugin;
    },
    callType: function() {
        return callType;
    },
    sanitize: function() {
        return sanitize;
    },
    serialize: function() {
        return serialize;
    },
    safeJsonStringify: function() {
        return safeJsonStringify;
    },
    getStringifier: function() {
        return getStringifier;
    }
});
const _errors = require("./errors");
const Types = {};
const Primitives = new Set();
const Plugins = {};
function _addType(name, typeMeta) {
    if (name in Types) {
        throw new Error(`Type "${name}" already exist.`);
    }
    Types[name] = typeMeta;
    Primitives.add(name);
}
const addType = (name, typeMeta)=>{
    _addType(name, typeMeta);
    _addType(typeMeta.name, typeMeta);
    typeMeta.alias?.forEach((a)=>{
        _addType(a, typeMeta);
    });
};
const addPlugin = (name, plugin)=>{
    Plugins[name] = plugin;
};
const callType = (method)=>(value, typeInfo, i18n, fieldPath)=>{
        if (!Primitives.has(typeInfo.type)) {
            throw new _errors.InvalidArgument(`Unsuppported primitive type: "${typeInfo.type}".`);
        }
        const typeObject = Types[typeInfo.type];
        return typeObject[method](value, typeInfo, i18n, fieldPath);
    };
const sanitize = callType("sanitize");
const serialize = callType("serialize");
const safeJsonStringify = (value)=>{
    const bigintWriter = Plugins['bigintWriter'];
    if (bigintWriter) {
        const replacer = (_, value)=>typeof value === "bigint" ? bigintWriter(value) : value;
        return JSON.stringify(value, replacer);
    }
    return JSON.stringify(value);
};
const getStringifier = ()=>{
    const bigintWriter = Plugins['bigintWriter'];
    if (bigintWriter) {
        return (value)=>typeof value === "bigint" ? bigintWriter(value) : value.toString();
    }
    return null;
};
// compatibility
Types.sanitize = sanitize;
Types.serialize = serialize;
Types.primitives = Primitives;

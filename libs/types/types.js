import { InvalidArgument } from "./errors";

export const Types = {};
export const Primitives = new Set();
export const Plugins = {};

function _addType(name, typeMeta) {
    if (name in Types) {
        throw new Error(`Type "${name}" already exist.`);
    }

    Types[name] = typeMeta;
    Primitives.add(name);
}

export const addType = (name, typeMeta) => {
    _addType(name, typeMeta);
    _addType(typeMeta.name, typeMeta);

    typeMeta.alias?.forEach((a) => {
        _addType(a, typeMeta);
    });
};

export const addPlugin = (name, plugin) => {
    Plugins[name] = plugin
};

export const callType = (method) => (value, typeInfo, i18n, fieldPath) => {
    if (!Primitives.has(typeInfo.type)) {
        throw new InvalidArgument(`Unsuppported primitive type: "${typeInfo.type}".`);
    }

    const typeObject = Types[typeInfo.type];
    return typeObject[method](value, typeInfo, i18n, fieldPath);
};

export const sanitize = callType("sanitize");
export const serialize = callType("serialize");

export const safeJsonStringify = (value) => {
    const bigintWriter = Plugins['bigintWriter'];
    if (bigintWriter) {
        const replacer = (_, value) =>
            typeof value === "bigint" ? bigintWriter(value) : value;

        return JSON.stringify(value, replacer);
    }

    return JSON.stringify(value);
};

export const getStringifier = () => {
    const bigintWriter = Plugins['bigintWriter'];
    if (bigintWriter) {
        return (value) =>
            typeof value === "bigint" ? bigintWriter(value) : value.toString();
    }

    return null;
};

// compatibility
Types.sanitize = sanitize;
Types.serialize = serialize;
Types.primitives = Primitives;
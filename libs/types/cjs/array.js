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
    sanitizeArray: function() {
        return sanitizeArray;
    },
    default: function() {
        return _default;
    }
});
const _find = /*#__PURE__*/ _interop_require_default(require("lodash/find"));
const _errors = require("./errors");
const _types = require("./types");
const _csvLineParse = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/csvLineParse"));
const _arrayToCsv = /*#__PURE__*/ _interop_require_default(require("@galaxar/utils/arrayToCsv"));
const _padding = require("@galaxar/utils/padding");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function sanitizeArray(value, typeInfo, i18n, fieldPath) {
    if (value == null) return null;
    const raw = value;
    if (typeof value === "string") {
        if (typeInfo.csv) {
            return (0, _csvLineParse.default)(value, {
                delimiter: typeInfo.delimiter || ","
            });
        } else {
            const trimmed = value.trim();
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                value = sanitizeArray(JSON.parse(trimmed), typeInfo, i18n, fieldPath);
            }
        }
    }
    if (Array.isArray(value)) {
        if (typeInfo.elementSchema) {
            const schema = typeof typeInfo.elementSchema === "function" ? typeInfo.elementSchema() : typeInfo.elementSchema;
            return value.map((a, i)=>_types.Types.sanitize(a, schema, i18n, (0, _padding.padLeft)(`[${i}]`, fieldPath)));
        }
        return value;
    }
    throw new _errors.ValidationError("Invalid array value.", {
        value: raw,
        meta: typeInfo
    });
}
const T_ARRAY = {
    name: "array",
    alias: [
        "list"
    ],
    defaultValue: [],
    validate: validateArray,
    sanitize: sanitizeArray,
    serialize: (value, typeInfo)=>value == null ? null : typeInfo?.csv ? (0, _arrayToCsv.default)(value, typeInfo?.delimiter) : JSON.stringify(value)
};
const _default = T_ARRAY;

import { ValidationError } from "./errors";
import { Types, safeJsonStringify, getStringifier, beginSanitize } from "./types";

import csvLineParse from "@galaxar/utils/csvLineParse";
import arrayToCsv from "@galaxar/utils/arrayToCsv";
import { padLeft } from "@galaxar/utils/padding";

const T_ARRAY = {
    name: "array",
    alias: ["list"],
    defaultValue: [],
    validate: value => Array.isArray(value),
    sanitize: (value, meta, i18n, path) => {
        const [ isDone, sanitized ] = beginSanitize(value, meta, i18n, path);
        if (isDone) return sanitized;

        const raw = value;

        if (typeof value === "string") {
            if (meta.csv) {
                value = csvLineParse(value, { delimiter: meta.delimiter || "," });
            } else {
                const trimmed = value.trim();
                if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                    value = JSON.parse(trimmed);
                }
            }
        }

        if (Array.isArray(value)) {
            if (meta.elementSchema) {
                const schema =
                    typeof meta.elementSchema === "function" ? meta.elementSchema() : meta.elementSchema;

                return value.map((a, i) => Types.sanitize(a, schema, i18n, padLeft(`[${i}]`, path)));
            }

            return value;
        }

        throw new ValidationError("Invalid array value.", {
            value: raw,
            meta,
            i18n,
            path
        });
    },
    serialize: (value, typeInfo) =>
        value == null ? null : typeInfo?.csv ? arrayToCsv(value, typeInfo?.delimiter, getStringifier()) : safeJsonStringify(value),
};

export default T_ARRAY;

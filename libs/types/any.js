import { identity } from "./functions";

const T_ANY = {
    name: "any",
    alias: ["*"],
    defaultValue: null,

    sanitize: identity,
    serialize: (value) => (typeof value === "object" ? JSON.stringify(value) : value),
};

export default T_ANY;

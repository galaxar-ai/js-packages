import { identity, everTrue } from "./functions";

const T_ANY = {
    name: "any",
    alias: ["*"],
    defaultValue: null,
    validate: everTrue,
    sanitize: identity,
    serialize: (value) => (typeof value === "object" ? JSON.stringify(value) : value),
};

export default T_ANY;

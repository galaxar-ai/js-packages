import { _, get, isPlainObject } from "@galaxar/utils";

// Cache for storing user tokens
const tokenCache = {};

/**
 * Returns a middleware function that adds user authentication to a client.
 * @param {string|Object} userTag - The user tag or user authentication object.
 * @returns {Function} A middleware function that adds user authentication to a client.
 * @throws {Error} If the user authentication settings are missing required fields.
 */
function defaultUserAuth(userTag) {
    return async (app, client) => {
        // If no user tag is provided, remove the onSending function and return the client
        if (!userTag) {
            delete client.onSending;
            return client;
        }

        let token, userAuth;

        // If the user tag is an object, use it as the user authentication object
        if (isPlainObject(userTag)) {
            token = tokenCache[userTag.userTag];
            userAuth = userTag;
        } else {
            // Otherwise, get the user authentication object from the app settings
            token = tokenCache[userTag];
            userAuth = app.settings.userAuth[userTag];
        }

        // If the token is not cached, authenticate the user and cache the token
        if (!token) {
            if (!userAuth.endpoint || !userAuth.username || !userAuth.password) {
                throw new Error(
                    `"endpoint", "username", "password" is required for "userAuth" settings of user "${userTag}".`
                );
            }

            let body = await client.post(
                userAuth.endpoint,
                {
                    username: userAuth.username,
                    password: userAuth.password,
                },
                userAuth.query,
                userAuth.headers ? { headers: userAuth.headers } : null
            );
            if (userAuth.tokenKey) {
                token = get(body, userAuth.tokenKey);
            } else {
                token = body.token;
            }
            tokenCache[userTag] = token;

            app.log("info", `Logged in with [${userTag}].`);
        }

        // Add the token to the Authorization header of each request
        client.onSending = (req) => {
            req.set("Authorization", `Bearer ${token}`);
        };
    };
}

export default defaultUserAuth;
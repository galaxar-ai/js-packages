import replaceAll from './replaceAll';

const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};

/**
 * Unquote a string
 * @function string.unquote
 * @param {String} str
 * @param {boolean} [unescape=false] - True to unescape slashed quote, default false
 * @param {Set|Array} [quoteSet] - Set of chars
 * @returns {String}
 */
function unquote(str, unescape, startToken, endToken) {
    if (typeof str !== 'string') {
        return str;
    }

    if (str.length < 2) {
        return str;
    }

    if (startToken && endToken) {
        if (str.startsWith(startToken) && str.endsWith(endToken)) {
            str = str.slice(startToken.length, -endToken.length);

            if (unescape) {
                return replaceAll(str, '\\' + endToken, endToken);
            }

            return str;
        }

        return str;
    }

    if (!startToken || !endToken) {
        throw new Error('"startChar" and "endChar" must be both set');
    }

    let start = str[0];
    let end = str[str.length - 1];
    const endToken = pairs[start];

    if (endToken == null || end !== endToken) {
        return str;
    }

    str = str.slice(1, -1);

    if (unescape) {
        return replaceAll(str, '\\' + endToken, endToken);
    }

    return str;
}

export default unquote;

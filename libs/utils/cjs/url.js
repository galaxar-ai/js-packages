/**
 * @module url
 * @borrows string.urlAppendQuery as appendQuery
 * @borrows string.urlJoin as join
 * @borrows string.urlObjectToQueryString as objectToQueryString
 * @borrows string.urlQueryStringToObject as queryStringToObject
 */ "use strict";
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
    appendQuery: function() {
        return _urlAppendQuery.default;
    },
    join: function() {
        return _urlJoin.default;
    },
    objectToQueryString: function() {
        return _urlObjectToQueryString.default;
    },
    queryStringToObject: function() {
        return _urlQueryStringToObject.default;
    }
});
var _urlAppendQuery = /*#__PURE__*/ _interop_require_default(require("./urlAppendQuery"));
var _urlJoin = /*#__PURE__*/ _interop_require_default(require("./urlJoin"));
var _urlObjectToQueryString = /*#__PURE__*/ _interop_require_default(require("./urlObjectToQueryString"));
var _urlQueryStringToObject = /*#__PURE__*/ _interop_require_default(require("./urlQueryStringToObject"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _superagent = /*#__PURE__*/ _interop_require_default(require("superagent"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const superagentAdapter = ()=>{
    const agent = _superagent.default.agent();
    return {
        createRequest (method, url) {
            return agent[method](url);
        }
    };
};
const _default = superagentAdapter;

//# sourceMappingURL=superagent.js.map
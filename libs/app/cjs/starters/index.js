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
    startWorker: function() {
        return _worker.default;
    },
    startLoopWorker: function() {
        return _loopWorker.default;
    },
    startQueueWorker: function() {
        return _queueWorker.default;
    },
    startCommand: function() {
        return _command.default;
    }
});
const _worker = /*#__PURE__*/ _interop_require_default(require("./worker"));
const _loopWorker = /*#__PURE__*/ _interop_require_default(require("./loopWorker"));
const _queueWorker = /*#__PURE__*/ _interop_require_default(require("./queueWorker"));
const _command = /*#__PURE__*/ _interop_require_default(require("./command"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=index.js.map
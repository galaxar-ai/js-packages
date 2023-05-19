'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _utils = require('@galaxar/utils');
const _worker = _interop_require_default(require('./worker'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
async function startLoopWorker(worker, options) {
    let { interval, ...workerOptions } = { interval: 1e3, throwOnError: true, ...options };
    return (0, _worker.default)(async (app) => {
        process.on('SIGINT', () => {
            app.stop_()
                .then(() => {})
                .catch((error) => console.error(error.message || error));
        });
        let lastResult;
        while (app.started) {
            lastResult = await worker(app, lastResult);
            if (app.started) {
                await (0, _utils.sleep_)(interval);
            }
        }
        return lastResult;
    }, workerOptions);
}
const _default = startLoopWorker;
//# sourceMappingURL=loopWorker.js.map

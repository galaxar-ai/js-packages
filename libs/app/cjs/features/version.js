'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _sys = require('@galaxar/sys');
const _Feature = _interop_require_default(require('../Feature'));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const _default = {
    stage: _Feature.default.INIT,
    load_: async function (app, version) {
        if (version === '@@package') {
            let pkgFile = app.toAbsolutePath('package.json');
            if (!(await _sys.fs.exists(pkgFile))) {
                throw new Error('"package.json" not found in working directory. CWD: ' + app.workingPath);
            }
            let pkg = await _sys.fs.readJson(pkgFile);
            version = pkg.version;
        }
        app.version = version;
    },
};
//# sourceMappingURL=version.js.map

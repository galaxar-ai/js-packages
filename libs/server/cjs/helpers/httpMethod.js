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
const { _ , isPlainObject  } = require('@galaxar/utils');
/**
 * Decorator for http method
 * @param {*} method
 * @param {*} middlewares
 * @returns
 */ function httpMethod(method, middlewares) {
    if (arguments.length === 3) {
        return httpMethod('get')(...Array.prototype.slice.call(arguments));
    }
    return function(target, name, descriptor) {
        let targetFunction, isHof = false;
        if (arguments.length === 1 && typeof target === 'function') {
            targetFunction = target;
            isHof = true;
        } else if (arguments.length === 1 && target.kind === 'method') {
            targetFunction = target.descriptor.value;
            target.descriptor.enumerable = true;
        } else if (descriptor && descriptor.value) {
            targetFunction = descriptor.value;
            descriptor.enumerable = true;
        } else {
            throw new Error('Unsupported scenario.');
        }
        if (targetFunction) {
            if (typeof method === 'string') {
                let pos = method.indexOf(':/');
                if (pos !== -1) {
                    if (pos === 0) {
                        throw new Error('Invalid httpMethod decorator param: ' + method);
                    }
                    // like get:/, or post:/
                    //override actionName as route
                    targetFunction.__metaRoute = method.substr(pos + 1);
                    method = method.substr(0, pos).toLocaleLowerCase();
                }
            } else {
                method = 'get';
            }
            targetFunction.__metaHttpMethod = method;
            if (middlewares) {
                if (isPlainObject(middlewares)) {
                    targetFunction.__metaMiddlewares = _.map(middlewares, (options, name)=>({
                            name,
                            options
                        }));
                } else {
                    targetFunction.__metaMiddlewares = _.castArray(middlewares);
                }
            }
        }
        return isHof ? targetFunction : descriptor;
    };
}
const _default = httpMethod;

//# sourceMappingURL=httpMethod.js.map
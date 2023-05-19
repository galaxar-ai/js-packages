'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
        return _default;
    },
});
const _utils = require('@galaxar/utils');
const DefaultMethods = {
    get: 'get',
    post: 'post',
    put: 'put',
    del: 'del',
    delete: 'del',
    upload: 'post',
    download: 'get',
};
function resToPath(parts) {
    return parts ? (Array.isArray(parts) ? parts.map((res) => encodeURIComponent(res)).join('/') : parts) : '';
}
class HttpClient {
    initReq(httpMethod, url) {
        return this.agent[httpMethod](url);
    }
    async do(method, path, query, body, options) {
        method = method.toLowerCase();
        const _options = { ...this.options, ...options };
        let httpMethod = _options.httpMethod ?? DefaultMethods[method];
        if (!httpMethod) {
            throw new Error('Invalid method: ' + method);
        }
        let url =
            path.startsWith('http:') || path.startsWith('https:') ? path : _utils.url.join(_options.endpoint, path);
        let req = this.initReq(httpMethod, url);
        if (this.onSending) {
            this.onSending(req);
        }
        if (_options.onSending) {
            _options.onSending(req);
        }
        if (_options.timeout) {
            req.timeout(_options.timeout);
        }
        if (_options.headers) {
            _utils._.each(_options.headers, (v, k) => {
                req.set(k, v);
            });
        }
        if (_options.withCredentials) {
            req.withCredentials();
        }
        if (query) {
            req.query(query);
        }
        if (method === 'download') {
            if (httpMethod !== 'get') {
                req.send(body);
            }
        } else if (method === 'upload') {
            if (_options.formData) {
                _utils._.each(_options.formData, (v, k) => {
                    req.field(k, v);
                });
            }
            req.attach(_options.fileField ?? 'file', body, _options.fileName);
        } else if (httpMethod !== 'get') {
            req.send(body ?? _options.body);
        }
        if (_options.onProgress) {
            req.on('progress', _options.onProgress);
        }
        try {
            const res = await req;
            const result = res.type.startsWith('text/') ? res.text : res.body;
            if (this.onResponse) {
                this.onResponse(req, res);
            }
            if (_options.onResponse) {
                _options.onResponse(req, res);
            }
            return result;
        } catch (error) {
            const _onError = _options.onError ?? this.onError;
            if (error.response && error.response.error) {
                const _responseError = error.response.error;
                if (error.response.type === 'application/json') {
                    _responseError.body = JSON.parse(error.response.text);
                }
                if (_onError != null) {
                    return _onError(_responseError, error);
                }
                throw _responseError;
            }
            if (_onError != null) {
                return _onError(error);
            }
            throw error;
        }
    }
    async get(resource, query, options) {
        return this.do('get', resToPath(resource), query, null, options);
    }
    async post(resource, data, query, options) {
        return this.do('post', resToPath(resource), query, data, options);
    }
    async put(resource, data, query, options) {
        return this.do('put', resToPath(resource), query, data, options);
    }
    async del(resource, query, options) {
        return this.do('del', resToPath(resource), query, null, options);
    }
    async delete(...args) {
        return this.del(...args);
    }
    async upload(resource, file, query, options) {
        return this.do('upload', resToPath(resource), query, file, options);
    }
    async download(resource, query, options) {
        return this.do('download', resToPath(resource), query, null, options);
    }
    constructor(agent, endpointOrOptions) {
        this.agent = agent;
        this.options = typeof endpointOrOptions === 'string' ? { endpoint: endpointOrOptions } : endpointOrOptions;
    }
}
const _default = HttpClient;
//# sourceMappingURL=HttpClient.js.map

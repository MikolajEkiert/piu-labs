class Ajax {
   constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.timeout = options.timeout || 5000;
        this.headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };
    }
    async _request(method, url, data, options) {
        const opts = options || {};
        const mergedHeaders = Object.assign({}, this.headers, opts.headers || {});
        const timeout = typeof opts.timeout === 'number' ? opts.timeout : this.timeout;
        const baseURL = opts.baseURL || this.baseURL || '';
        const controller = new AbortController();
        if (opts.signal) {
            if (opts.signal.aborted) controller.abort();
            else opts.signal.addEventListener('abort', () => controller.abort(), { once: true });
        }
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchOpts = Object.assign({}, opts);
        delete fetchOpts.headers;
        delete fetchOpts.timeout;
        delete fetchOpts.baseURL;

        const fullUrl = `${baseURL}${url}`;

        if (method !== 'GET' && method !== 'HEAD' && data !== undefined) {
            fetchOpts.body = JSON.stringify(data);
            if (!mergedHeaders['Content-Type'] && !mergedHeaders['content-type']) {
                mergedHeaders['Content-Type'] = 'application/json';
            }
        }

        fetchOpts.method = method;
        fetchOpts.headers = mergedHeaders;
        fetchOpts.signal = controller.signal;

        try {
            const res = await fetch(fullUrl, fetchOpts);
            if (!res.ok) {
                const text = await res.text().catch(() => null);
                const err = new Error(`HTTP ${res.status} ${res.statusText}`);
                err.status = res.status;
                err.statusText = res.statusText;
                err.body = text;
                throw err;
            }

            const text = await res.text();
            if (!text) return null;
            try {
                return JSON.parse(text);
            } catch (e) {
                const err = new Error('Failed to parse JSON response');
                err.original = e;
                err.text = text;
                throw err;
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error(`Request to ${fullUrl} aborted after ${timeout}ms`);
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    async get(url, options) {
        return this._request('GET', url, undefined, options);
    }

    async post(url, data, options) {
        return this._request('POST', url, data, options);
    }

    async put(url, data, options) {
        return this._request('PUT', url, data, options);
    }

    async delete(url, options) {
        return this._request('DELETE', url, undefined, options);
    }
}
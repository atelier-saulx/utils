import { hash, hashObjectIgnoreKeyOrder } from '@saulx/hash';
function retryPromiseFn(fn, retry) {
    let retries = 0;
    const retryIt = (...args) => new Promise((resolve, reject) => {
        fn(...args)
            .then((r) => resolve(r))
            .catch((err) => {
            retries++;
            if (retry.logError) {
                retry.logError(err, args, retries);
            }
            if (!retry.max || retries < retry.max) {
                setTimeout(() => {
                    resolve(retryIt(...args));
                }, Math.min(retries * (retry.minTime ?? 1e3), retry.maxTime ?? Infinity));
            }
            else {
                reject(err);
            }
        });
    });
    return retryIt;
}
const defaultDedup = (...args) => {
    let x = '';
    for (const arg of args) {
        if (arg !== undefined) {
            if (typeof arg === 'object') {
                x += hashObjectIgnoreKeyOrder(arg);
            }
            else {
                x += hash(arg);
            }
        }
    }
    if (!x) {
        // random id
        return (~~(Math.random() * 99999)).toString(16);
    }
    return x;
};
function queued(promiseFn, opts = {}) {
    if (opts.retry) {
        promiseFn = retryPromiseFn(promiseFn, opts.retry);
    }
    // default options
    if (!opts.dedup) {
        opts.dedup = defaultDedup;
    }
    if (!opts.concurrency) {
        opts.concurrency = 1;
    }
    const listeners = {};
    const keysInProgress = new Set();
    const drain = () => {
        for (const key in listeners) {
            if (keysInProgress.size === opts.concurrency) {
                break;
            }
            if (!keysInProgress.has(key)) {
                const l = listeners[key];
                keysInProgress.add(key);
                // @ts-ignore
                promiseFn(...l.args)
                    .then((v) => {
                    delete listeners[key];
                    keysInProgress.delete(key);
                    l.listeners.forEach(([resolve]) => {
                        resolve(v);
                    });
                    drain();
                })
                    .catch((err) => {
                    delete listeners[key];
                    keysInProgress.delete(key);
                    l.listeners.forEach(([, reject]) => {
                        reject(err);
                    });
                    drain();
                });
                if (keysInProgress.size === opts.concurrency) {
                    break;
                }
            }
        }
    };
    return (...args) => {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const id = opts.dedup(...args);
            if (!listeners[id]) {
                listeners[id] = { args, listeners: [[resolve, reject]] };
            }
            else {
                listeners[id].listeners.push([resolve, reject]);
            }
            // @ts-ignore
            if (keysInProgress.size < opts.concurrency) {
                drain();
            }
        });
    };
}
export default queued;
//# sourceMappingURL=queued.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("@saulx/hash");
const is_plain_obj_1 = __importDefault(require("is-plain-obj"));
function retryPromiseFn(fn, retry) {
    let retries = 0;
    const retryIt = async (...args) => {
        try {
            // @ts-ignore
            return await fn(...args);
        }
        catch (err) {
            retries++;
            if (!retry.max || retries < retry.max) {
                setTimeout(() => {
                    retryIt(...args);
                }, Math.min(retries * (retry.minTime ?? 1e3), retry.maxTime ?? Infinity));
            }
            else {
                throw err;
            }
        }
    };
    return retryIt;
}
const defaultDedup = (...args) => {
    let x = '';
    for (const arg of args) {
        if (arg !== undefined) {
            if (typeof arg === 'object') {
                if (Array.isArray(arg)) {
                    x += (0, hash_1.hashObjectIgnoreKeyOrder)(arg);
                }
                else if ((0, is_plain_obj_1.default)(arg)) {
                    x += (0, hash_1.hashObjectIgnoreKeyOrder)(arg);
                }
            }
            else {
                x += (0, hash_1.hash)(arg);
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
            const id = opts.dedup(...args);
            if (!listeners[id]) {
                listeners[id] = { args, listeners: [[resolve, reject]] };
            }
            else {
                listeners[id].listeners.push([resolve, reject]);
            }
            if (keysInProgress.size < opts.concurrency) {
                drain();
            }
        });
    };
}
exports.default = queued;
//# sourceMappingURL=queued.js.map
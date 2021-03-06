"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const is_plain_obj_1 = __importDefault(require("is-plain-obj"));
const defaultDedup = (...args) => {
    let x = '';
    for (let arg of args) {
        if (arg !== undefined) {
            if (typeof arg === 'object') {
                if (Array.isArray(arg)) {
                    x += hash_1.hashObjectIgnoreKeyOrder(arg);
                }
                else if (is_plain_obj_1.default(arg)) {
                    x += hash_1.hashObjectIgnoreKeyOrder(arg);
                }
            }
            else {
                x += hash_1.hash(arg);
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
        for (let key in listeners) {
            if (keysInProgress.size === opts.concurrency) {
                break;
            }
            if (!keysInProgress.has(key)) {
                const l = listeners[key];
                keysInProgress.add(key);
                // console.log('EXEC', 'conc', keysInProgress.size, key, l.args)
                promiseFn(...l.args)
                    .then(v => {
                    delete listeners[key];
                    keysInProgress.delete(key);
                    l.listeners.forEach(([resolve]) => {
                        resolve(v);
                    });
                    drain();
                })
                    .catch(err => {
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
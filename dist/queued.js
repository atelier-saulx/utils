"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const is_plain_object_1 = __importDefault(require("is-plain-object"));
const defaultDedup = (...args) => {
    let x = '';
    for (let arg of args) {
        if (typeof arg === 'object') {
            if (is_plain_object_1.default(arg)) {
                x += hash_1.hashObjectIgnoreKeyOrder(arg);
            }
            else {
                console.log('ignore!');
            }
        }
        else {
            x += hash_1.hash(arg);
        }
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
    let inProgress = false;
    const drain = () => { };
    return (a, b, c, d, e, f, g, h, i, j) => {
        return new Promise((resolve, reject) => {
            // here we make the function
            const id = opts.dedup(a, b, c, d, e, f, g, h, i, j);
            console.log('yesh', id);
            promiseFn(a, b, c, d, e, f, g, h, i, j)
                .then(resolve)
                .catch(reject);
        });
    };
}
exports.default = queued;
//# sourceMappingURL=queued.js.map
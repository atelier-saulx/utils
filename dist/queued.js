"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const defaultMemoize = (...args) => {
    // go trough all args
    const x = hash_1.hashObjectIgnoreKeyOrder(args);
    console.log(x);
    return x;
};
// function map<T, K>(list: T[], fn(x: T => K): K[]
function queued(promiseFn, opts = {}) {
    // default options
    if (!opts.memoize) {
        opts.memoize = defaultMemoize;
    }
    if (!opts.concurrency) {
        opts.concurrency = 1;
    }
    const listeners = {};
    let inProgress = false;
    const drain = () => { };
    return (...args) => {
        return new Promise((resolve, reject) => {
            // here we make the function
            console.log('yesh');
            promiseFn(...args)
                .then(resolve)
                .catch(reject);
        });
    };
}
exports.default = queued;
//# sourceMappingURL=queued.js.map
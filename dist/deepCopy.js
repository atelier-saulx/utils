"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepCopy = (a) => {
    const r = a.constructor === Array ? [] : {};
    for (let k in a) {
        if (a[k] !== null && typeof a[k] === 'object') {
            r[k] = deepCopy(a[k]);
        }
        else {
            r[k] = a[k];
        }
    }
    return r;
};
exports.default = deepCopy;
//# sourceMappingURL=deepCopy.js.map
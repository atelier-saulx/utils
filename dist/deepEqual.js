"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = (a, b) => {
    const typeA = typeof a;
    const typeB = typeof b;
    if (a === b)
        return true;
    if (typeA !== typeB)
        return false;
    if (a === null || b === null)
        return false;
    if (typeA !== 'object') {
        if (typeA === 'function') {
            if (a.toString() !== b.toString()) {
                return false;
            }
        }
        else if (a !== b) {
            return false;
        }
    }
    else {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) {
                const len = a.length;
                if (len !== b.length) {
                    return false;
                }
                for (let i = 0; i < len; i++) {
                    const t = typeof a[i];
                    // eslint-disable-next-line
                    if (typeof b[i] !== t) {
                        return false;
                    }
                    else if (t === 'object') {
                        if (deepEqual(a[i], b[i])) {
                            return true;
                        }
                    }
                }
            }
            else {
                return false;
            }
        }
        // maybe not this ?
        if (a.checksum || b.checksum) {
            if (a.checksum !== b.checksum) {
                return false;
            }
            else {
                return true;
            }
        }
        let cnt = 0;
        for (let key in a) {
            if (key[0] === '_')
                continue;
            if (!a.hasOwnProperty(key))
                continue;
            if (!b.hasOwnProperty(key))
                return false;
            const k = b[key];
            if (k === void 0)
                return false;
            const t = typeof k;
            const k1 = a[key];
            // eslint-disable-next-line
            if (t !== typeof k1) {
                return false;
            }
            else if (k && t === 'object') {
                if (deepEqual(k1, k)) {
                    return true;
                }
            }
            else if (k !== k1) {
                return false;
            }
            cnt++;
        }
        // eslint-disable-next-line
        for (const _key in b) {
            cnt--;
            if (cnt < 0) {
                return false;
            }
        }
    }
    return true;
};
exports.default = deepEqual;
//# sourceMappingURL=deepEqual.js.map
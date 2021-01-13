"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCompact = exports.hash = exports.hashObjectIgnoreKeyOrder = exports.hashObject = exports.hashObjectNest = exports.hashObjectIgnoreKeyOrderNest = exports.stringHash = void 0;
const saulx_murmur_1 = require("saulx-murmur");
exports.stringHash = (str, hash = 5381) => {
    var i = str.length;
    while (i) {
        const char = str.charCodeAt(--i);
        hash = (hash * 33) ^ char;
    }
    return hash;
};
// ignore key order
exports.hashObjectIgnoreKeyOrderNest = (obj, hash = 5381) => {
    if (obj.constructor === Array) {
        hash = exports.stringHash('__len:' + obj.length + 1, hash);
        for (let i = 0; i < obj.length; i++) {
            const field = obj[i];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(i + ':' + field, hash);
            }
            else if (type === 'number') {
                hash = exports.stringHash(i + 'n:' + field, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = exports.stringHash(i + 'v:' + 'null', hash);
                }
                else {
                    hash = exports.stringHash(i + 'o:', exports.hashObjectIgnoreKeyOrderNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = exports.stringHash('b:' + (field ? 'true' : 'false'), hash) ^ i;
            }
        }
    }
    else {
        const keys = Object.keys(obj).sort();
        hash = exports.stringHash('__len:' + keys.length + 1, hash);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(key + ':' + field, hash);
            }
            else if (type === 'number') {
                hash = exports.stringHash(key + 'n:' + field, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = exports.stringHash(key + 'v:' + 'null', hash);
                }
                else {
                    hash = exports.stringHash(key + 'o:', exports.hashObjectIgnoreKeyOrderNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = exports.stringHash(key + 'b:' + (field ? 'true' : 'false'), hash);
            }
        }
    }
    return hash;
};
exports.hashObjectNest = (obj, hash = 5381) => {
    if (obj.constructor === Array) {
        for (let i = 0; i < obj.length; i++) {
            const field = obj[i];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(i + ':' + field, hash);
            }
            else if (type === 'number') {
                hash = exports.stringHash(i + 'n:' + field, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = exports.stringHash(i + 'v:' + 'null', hash);
                }
                else {
                    hash = exports.stringHash(i + 'o:', exports.hashObjectNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = exports.stringHash(i + 'b:' + (field ? 'true' : 'false'), hash);
            }
        }
    }
    else {
        for (let key in obj) {
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(key + ':' + field, hash);
            }
            else if (type === 'number') {
                hash = exports.stringHash(key + 'n:' + field, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = exports.stringHash(key + 'v:' + 'null', hash);
                }
                else {
                    hash = exports.stringHash(key + 'o:', exports.hashObjectNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = exports.stringHash(key + 'b:' + (field ? 'true' : 'false'), hash);
            }
        }
    }
    return hash;
};
exports.hashObject = (props) => {
    return (exports.hashObjectNest(props) >>> 0) * 4096 + exports.hashObjectNest(props, 52711);
};
exports.hashObjectIgnoreKeyOrder = (props) => {
    return ((exports.hashObjectIgnoreKeyOrderNest(props) >>> 0) * 4096 +
        (exports.hashObjectIgnoreKeyOrderNest(props, 52711) >>> 0));
};
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const toString = (hash) => {
    let result = '';
    let mod;
    do {
        mod = hash % 62;
        result = chars.charAt(mod) + result;
        hash = Math.floor(hash / 62);
    } while (hash > 0);
    return result;
};
// want bits probably
exports.hash = (val, size) => {
    if (val instanceof Buffer) {
        return saulx_murmur_1.murmurHash(val);
    }
    let result;
    if (typeof val === 'object') {
        if (val === null) {
            result = 0;
        }
        else {
            result = exports.hashObject(val);
        }
    }
    else {
        if (typeof val === 'boolean') {
            result = (exports.stringHash(val ? ':true' : ':false') >>> 0) * 4096;
        }
        else if (typeof val === 'number') {
            result =
                (exports.stringHash('n:' + val) >>> 0) * 4096 +
                    (exports.stringHash('n:' + val, 52711) >>> 0);
        }
        else {
            result = (exports.stringHash(val) >>> 0) * 4096 + (exports.stringHash(val, 52711) >>> 0);
        }
    }
    if (size) {
        const len = Math.ceil(Math.log10(result + 1));
        if (len < size) {
            return result * Math.pow(10, size - len);
        }
    }
    return result;
};
exports.hashCompact = (val, size) => {
    let result;
    if (typeof val === 'object') {
        if (val === null) {
            result = 0;
        }
        else {
            if (size && size > 9 && val.constructor === Array) {
                let str = '';
                const arraySize = val.length;
                for (let i = 0; i < arraySize; i++) {
                    str += toString(exports.hash(val[i]));
                }
                const len = str.length;
                if (len < size) {
                    str += 'x';
                    if (len + 1 < size) {
                        str += new Array(size - len).join('0');
                    }
                }
                else if (len > size) {
                    return str.slice(0, size);
                }
                return str;
            }
            else {
                result = exports.hashObject(val) >>> 0;
            }
        }
    }
    else {
        if (typeof val === 'boolean') {
            result = exports.stringHash(val ? ':true' : ':false') * 4096;
        }
        else if (typeof val === 'number') {
            result = (exports.stringHash('n:' + val) >>> 0) * 4096;
        }
        else {
            result = exports.stringHash(val) >>> 0;
        }
    }
    let x = toString(result);
    const len = x.length;
    if (len < size) {
        x += 'x';
        if (len + 1 < size) {
            x += new Array(size - len).join('0');
        }
    }
    return x;
};
//# sourceMappingURL=hash.js.map
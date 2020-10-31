"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCompact = exports.hash = exports.hashObjectIgnoreKeyOrder = exports.hashObject = exports.hashObjectNest = exports.hashObjectIgnoreKeyOrderNest = exports.stringHash = void 0;
exports.stringHash = (str, hash = 5381) => {
    var i = str.length;
    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash;
};
const hashKey = (key, hash = 5381) => {
    return exports.stringHash(key, hash) * 5381;
};
const hashNumber = (nr, hash = 5381) => {
    return ((hash * 33) ^ nr) * 5381;
};
const hashBool = (val, hash = 5381) => {
    return ((hash * 33) ^ (val === true ? 1 : 0)) * 5381 * 33;
};
const nullHash = 5381 * 33;
// ignore key order
exports.hashObjectIgnoreKeyOrderNest = (obj, hash = 5381) => {
    if (obj.constructor === Array) {
        hash = hashNumber(obj.length + 1, hash);
        for (let i = 0; i < obj.length; i++) {
            const field = obj[i];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(field, hash) ^ hashNumber(i, hash);
            }
            else if (type === 'number') {
                hash = hashNumber(field, hash) ^ hashNumber(i, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = nullHash ^ hashNumber(i, hash);
                }
                else {
                    hash =
                        (33 * exports.hashObjectIgnoreKeyOrderNest(field, hash)) ^
                            hashNumber(i, hash);
                }
            }
            else if (type === 'boolean') {
                hash = hashBool(field, hash) ^ hashNumber(i, hash);
            }
        }
    }
    else {
        // super slow
        const keys = Object.keys(obj).sort();
        hash = hashNumber(keys.length + 1, hash);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(field, hash) ^ hashKey(key, hash);
            }
            else if (type === 'number') {
                hash = hashNumber(field, hash) ^ hashKey(key, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = nullHash ^ hashKey(key, hash);
                }
                else {
                    hash =
                        (33 * exports.hashObjectIgnoreKeyOrderNest(field, hash)) ^
                            hashKey(key, hash);
                }
            }
            else if (type === 'boolean') {
                hash = hashBool(field, hash) ^ hashKey(key, hash);
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
                hash = exports.stringHash(field, hash) ^ hashNumber(i, hash);
            }
            else if (type === 'number') {
                hash = hashNumber(field, hash) ^ hashNumber(i, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = nullHash ^ hashNumber(i, hash);
                }
                else {
                    hash = (33 * exports.hashObjectNest(field, hash)) ^ hashNumber(i, hash);
                }
            }
            else if (type === 'boolean') {
                hash = hashBool(field, hash) ^ hashNumber(i, hash);
            }
        }
    }
    else {
        for (let key in obj) {
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = exports.stringHash(field, hash) ^ hashKey(key, hash);
            }
            else if (type === 'number') {
                hash = hashNumber(field, hash) ^ hashKey(key, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = nullHash ^ hashKey(key, hash);
                }
                else {
                    hash = (33 * exports.hashObjectNest(field, hash)) ^ hashKey(key, hash);
                }
            }
            else if (type === 'boolean') {
                hash = hashBool(field, hash) ^ hashKey(key, hash);
            }
        }
    }
    return hash;
};
exports.hashObject = (props) => {
    return exports.hashObjectNest(props) >>> 0;
};
exports.hashObjectIgnoreKeyOrder = (props) => {
    return exports.hashObjectIgnoreKeyOrderNest(props) >>> 0;
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
    let result;
    if (typeof val === 'object') {
        if (val === null) {
            result = 0;
        }
        else {
            result = exports.hashObject(val) >>> 0;
        }
    }
    else {
        if (typeof val === 'boolean') {
            result = hashBool(val) >>> 0;
        }
        else if (typeof val === 'number') {
            result = ((nullHash ^ val) * 33) >>> 0;
        }
        else {
            result = exports.stringHash(val) >>> 0;
        }
    }
    if (size) {
        if (size < 10) {
            throw new Error('Minimum size for 32 bits is 10 numbers');
        }
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
            result = hashBool(val) >>> 0;
        }
        else if (typeof val === 'number') {
            result = ((nullHash ^ val) * 33) >>> 0;
        }
        else {
            result = exports.stringHash(val) >>> 0;
        }
    }
    if (size < 6) {
        throw new Error('Minimum size for 32 bits is 6 characters');
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
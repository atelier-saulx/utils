"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.hashObjectIgnoreKeyOrder = exports.hashObject = exports.hashObjectNest = exports.hashObjectIgnoreKeyOrderNest = exports.stringHash = void 0;
exports.stringHash = (str, hash = 5381) => {
    var i = str.length;
    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash;
};
const hashKey = (key, hash = 5381) => {
    return exports.stringHash(key, hash) * 33;
};
const hashNumber = (nr, hash = 5381) => {
    return ((hash * 33) ^ nr) * 33;
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
                hash = (exports.stringHash(field, hash) * 33) ^ hashNumber(i, hash);
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
                        (exports.hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
                            hashNumber(i, hash);
                }
            }
            else if (type === 'boolean') {
                hash =
                    (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^ hashNumber(i, hash);
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
                hash = (exports.stringHash(field, hash) * 33) ^ hashKey(key, hash);
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
                        (exports.hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
                            hashKey(key, hash);
                }
            }
            else if (type === 'boolean') {
                hash =
                    (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^ hashKey(key, hash);
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
                hash = (exports.stringHash(field, hash) * 33) ^ hashNumber(i, hash);
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
                        (exports.hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
                            hashNumber(i, hash);
                }
            }
            else if (type === 'boolean') {
                hash =
                    (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^ hashNumber(i, hash);
            }
        }
    }
    else {
        for (let key in obj) {
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = (exports.stringHash(field, hash) * 33) ^ hashKey(key, hash);
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
                        (exports.hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
                            hashKey(key, hash);
                }
            }
            else if (type === 'boolean') {
                hash =
                    (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^ hashKey(key, hash);
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
exports.hash = (val) => {
    if (typeof val === 'object') {
        if (val === null) {
            return 0;
        }
        else {
            return exports.hashObject(val) >>> 0;
        }
    }
    else {
        if (typeof val === 'number') {
            return (nullHash ^ val) >>> 0;
        }
        else {
            return exports.stringHash(val) >>> 0;
        }
    }
};
//# sourceMappingURL=hash.js.map
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
// ignore key order
exports.hashObjectIgnoreKeyOrderNest = (obj, hash = 5381) => {
    if (obj.constructor === Array) {
        for (let key in obj) {
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = (exports.stringHash(field, hash) * 33) ^ (exports.stringHash(key, hash) * 33);
            }
            else if (type === 'number') {
                hash = (((hash * 33) ^ field) * 33) ^ (exports.stringHash(key, hash) * 33);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = 5381 ^ (exports.stringHash(key, hash) * 33);
                }
                else {
                    hash =
                        (exports.hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
                            (exports.stringHash(key, hash) * 33);
                }
            }
            else if (type === 'boolean') {
                hash =
                    (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^
                        (exports.stringHash(key, hash) * 33);
            }
        }
    }
    else {
        // super slow
        const keys = Object.keys(obj).sort();
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = (exports.stringHash(field, hash) * 33) ^ (exports.stringHash(key, hash) * 33);
            }
            else if (type === 'number') {
                hash = (((hash * 33) ^ field) * 33) ^ (exports.stringHash(key, hash) * 33);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = 5381 ^ (exports.stringHash(key, hash) * 33);
                }
                else {
                    hash =
                        (exports.hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
                            (exports.stringHash(key, hash) * 33);
                }
            }
            else if (type === 'boolean') {
                hash =
                    (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^
                        (exports.stringHash(key, hash) * 33);
            }
        }
    }
    return hash;
};
exports.hashObjectNest = (obj, hash = 5381) => {
    for (let key in obj) {
        const field = obj[key];
        const type = typeof field;
        if (type === 'string') {
            hash = (exports.stringHash(field, hash) * 33) ^ (exports.stringHash(key, hash) * 33);
        }
        else if (type === 'number') {
            hash = (((hash * 33) ^ field) * 33) ^ (exports.stringHash(key, hash) * 33);
        }
        else if (type === 'object') {
            if (field === null) {
                hash = 5381 ^ (exports.stringHash(key, hash) * 33);
            }
            else {
                hash = (exports.hashObjectNest(field, hash) * 33) ^ (exports.stringHash(key, hash) * 33);
            }
        }
        else if (type === 'boolean') {
            hash =
                (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^
                    (exports.stringHash(key, hash) * 33);
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
            return ((5381 * 33) ^ val) >>> 0;
        }
        else {
            return exports.stringHash(val) >>> 0;
        }
    }
};
//# sourceMappingURL=hash.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.hashObject = exports.hashObjectNest = exports.stringHash = void 0;
exports.stringHash = (str, hash = 5381) => {
    var i = str.length;
    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash;
};
exports.hashObjectNest = (obj, hash = 5381) => {
    for (let key in obj) {
        const field = obj[key];
        const type = typeof field;
        if (type === 'string') {
            hash = (exports.stringHash(field, hash) * 33) ^ exports.stringHash(key, hash);
        }
        else if (type === 'number') {
            hash = (((hash * 33) ^ field) * 33) ^ exports.stringHash(key, hash);
        }
        else if (type === 'object') {
            if (field === null) {
                hash = 5381 ^ exports.stringHash(key, hash);
            }
            else {
                hash = (exports.hashObjectNest(field, hash) * 33) ^ exports.stringHash(key, hash);
            }
        }
        else if (type === 'boolean') {
            hash =
                (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^ exports.stringHash(key, hash);
        }
    }
    return hash;
};
exports.hashObject = (props) => {
    return exports.hashObjectNest(props) >>> 0;
};
exports.hash = (val) => {
    if (typeof val === 'object') {
        if (val === null) {
            return 0;
        }
        else {
            return exports.hashObject(val);
        }
    }
    else {
        if (typeof val === 'number') {
            return (5381 * 33) ^ val;
        }
        else {
            return exports.stringHash(val);
        }
    }
};
//# sourceMappingURL=hash.js.map
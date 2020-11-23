"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = str => {
    var i = str.length;
    let s = '';
    while (i) {
        s += toString(str.charCodeAt(--i));
    }
    return s;
};
//# sourceMappingURL=obscurify.js.map
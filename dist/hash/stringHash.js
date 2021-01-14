"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringHash = (str, hash = 5381) => {
    var i = str.length;
    while (i) {
        const char = str.charCodeAt(--i);
        hash = (hash * 33) ^ char;
    }
    return hash;
};
exports.default = stringHash;
//# sourceMappingURL=stringHash.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padLeft = (str, len, char) => {
    const l = str.length;
    for (let i = 0; i < len - l; i++) {
        str = char + str;
    }
    return str;
};
//# sourceMappingURL=padLeft.js.map
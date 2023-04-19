"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padRight = exports.padLeft = void 0;
const padLeft = (str, len, char) => {
    const l = str.length;
    for (let i = 0; i < len - l; i++) {
        str = char + str;
    }
    return str;
};
exports.padLeft = padLeft;
const padRight = (str, len, char) => {
    const l = str.length;
    for (let i = 0; i < len - l; i++) {
        str = str + char;
    }
    return str;
};
exports.padRight = padRight;
//# sourceMappingURL=padding.js.map
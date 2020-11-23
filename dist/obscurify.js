"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (str) => {
    var i = str.length;
    let s = '';
    while (i) {
        s += str.charCodeAt(--i);
    }
    return Number(s);
};
//# sourceMappingURL=obscurify.js.map
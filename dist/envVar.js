"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (str) => {
    str = str.replace(/[@-\\/|*&^%$#@!()\-+]/g, '_');
    str = str.replace(/^_+/, '');
    str = str.replace(/_+$/, '');
    return str.toUpperCase();
};
//# sourceMappingURL=envVar.js.map
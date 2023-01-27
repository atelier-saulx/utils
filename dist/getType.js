"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = (item) => {
    return item === null ? 'null' : Array.isArray(item) ? 'array' : typeof item;
};
//# sourceMappingURL=getType.js.map
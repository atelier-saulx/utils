"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = void 0;
const getType = (item) => {
    return item === null ? 'null' : Array.isArray(item) ? 'array' : typeof item;
};
exports.getType = getType;
//# sourceMappingURL=getType.js.map
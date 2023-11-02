export const getType = (item) => {
    return item === null ? 'null' : Array.isArray(item) ? 'array' : typeof item;
};
//# sourceMappingURL=getType.js.map
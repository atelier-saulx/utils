export const padLeft = (str, len, char) => {
    const l = str.length;
    for (let i = 0; i < len - l; i++) {
        str = char + str;
    }
    return str;
};
export const padRight = (str, len, char) => {
    const l = str.length;
    for (let i = 0; i < len - l; i++) {
        str = str + char;
    }
    return str;
};
//# sourceMappingURL=padding.js.map
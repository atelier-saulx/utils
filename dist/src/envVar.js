export default (str) => {
    str = str.replace(/[@-\\/|*&^%$#@!()\-+]/g, '_');
    str = str.replace(/^_+/, '');
    str = str.replace(/_+$/, '');
    return str.toUpperCase();
};
//# sourceMappingURL=envVar.js.map
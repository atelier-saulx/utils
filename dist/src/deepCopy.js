const deepCopy = (a) => {
    const r = (Array.isArray(a) ? [] : {});
    for (const k in a) {
        if (a[k] !== null && typeof a[k] === 'object') {
            // @ts-ignore
            r[k] = deepCopy(a[k]);
        }
        else {
            r[k] = a[k];
        }
    }
    return r;
};
export default deepCopy;
//# sourceMappingURL=deepCopy.js.map
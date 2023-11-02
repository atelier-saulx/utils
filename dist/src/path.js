export function setByPath(target, path, value) {
    if (typeof target !== 'object') {
        return target;
    }
    let d = target;
    for (let i = 0; i < path.length; i++) {
        const seg = path[i];
        if (i === path.length - 1) {
            d[seg] = value;
            break;
        }
        if (d[seg] === undefined) {
            if (typeof path[i + 1] === 'number') {
                d[seg] = [];
            }
            else {
                d[seg] = {};
            }
        }
        d = d[seg];
    }
    return target;
}
export const getByPath = (target, path) => {
    if (typeof target !== 'object') {
        return;
    }
    let d = target;
    for (let i = 0; i < path.length; i++) {
        const seg = path[i];
        if (d?.[seg] !== undefined) {
            d = d[seg];
        }
        else {
            d = undefined;
            break;
        }
    }
    return d;
};
//# sourceMappingURL=path.js.map
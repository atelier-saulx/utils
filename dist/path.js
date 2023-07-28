"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByPath = exports.setByPath = void 0;
function setByPath(target, path, value) {
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
exports.setByPath = setByPath;
const getByPath = (target, path) => {
    if (typeof target !== 'object') {
        return;
    }
    let d = target;
    for (let i = 0; i < path.length; i++) {
        const seg = path[i];
        if ((d === null || d === void 0 ? void 0 : d[seg]) !== undefined) {
            d = d[seg];
        }
        else {
            d = undefined;
            break;
        }
    }
    return d;
};
exports.getByPath = getByPath;
//# sourceMappingURL=path.js.map
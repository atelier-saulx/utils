"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = exports.deepMergeArrays = void 0;
const merge = (target, source) => {
    if (target &&
        typeof target === 'object' &&
        source &&
        typeof source === 'object') {
        if (source.constructor === Array) {
            for (let i = 0; i < source.length; i++) {
                if (i in target) {
                    if (target[i] &&
                        typeof target[i] === 'object' &&
                        source[i] &&
                        typeof source[i] === 'object') {
                        merge(target[i], source[i]);
                    }
                    else {
                        target[i] = source[i];
                    }
                }
                else {
                    target[i] = source[i];
                }
            }
        }
        else {
            for (const i in source) {
                if (i in target) {
                    if (target[i] &&
                        typeof target[i] === 'object' &&
                        source[i] &&
                        typeof source[i] === 'object') {
                        merge(target[i], source[i]);
                    }
                    else {
                        target[i] = source[i];
                    }
                }
                else {
                    target[i] = source[i];
                }
            }
        }
    }
};
function deepMergeArrays(target, ...sources) {
    if (!sources.length)
        return target;
    if (sources.length === 1) {
        merge(target, sources[0]);
        return target;
    }
    for (let i = 0; i < sources.length; i++) {
        merge(target, sources[i]);
    }
    return target;
}
exports.deepMergeArrays = deepMergeArrays;
const mergeExcludeArray = (target, source) => {
    if (target &&
        typeof target === 'object' &&
        source &&
        typeof source === 'object') {
        if (source.constructor === Array || target.constructor === Array) {
            return source;
        }
        else {
            for (const i in source) {
                if (i in target) {
                    if (target[i] &&
                        source[i] &&
                        typeof target[i] === 'object' &&
                        target[i].constructor !== Array &&
                        typeof source[i] === 'object' &&
                        source[i].constructor !== Array) {
                        const a = mergeExcludeArray(target[i], source[i]);
                        if (a !== target[i]) {
                            target[i] = a;
                        }
                    }
                    else {
                        target[i] = source[i];
                    }
                }
                else {
                    target[i] = source[i];
                }
            }
        }
    }
    return target;
};
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    if (sources.length === 1) {
        return mergeExcludeArray(target, sources[0]);
    }
    for (let i = 0; i < sources.length; i++) {
        const a = mergeExcludeArray(target, sources[i]);
        if (a !== target) {
            target = a;
        }
    }
    return target;
}
exports.deepMerge = deepMerge;
//# sourceMappingURL=deepMerge.js.map
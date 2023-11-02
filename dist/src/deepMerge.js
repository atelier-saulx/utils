const merge = (target, source) => {
    if (source.constructor === Array) {
        for (let i = 0; i < source.length; i++) {
            if (i in target) {
                if (target[i] &&
                    typeof target[i] === 'object' &&
                    source[i] &&
                    typeof source[i] === 'object') {
                    merge(target[i], source[i]);
                }
                else if (source[i] !== undefined) {
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
                else if (source[i] !== undefined) {
                    target[i] = source[i];
                }
            }
            else {
                target[i] = source[i];
            }
        }
    }
};
export function deepMergeArrays(target, ...sources) {
    if (!sources.length)
        return target;
    if (sources.length === 1) {
        const source = sources[0];
        if (target &&
            typeof target === 'object' &&
            source &&
            typeof source === 'object') {
            merge(target, source);
            return target;
        }
    }
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (target &&
            typeof target === 'object' &&
            source &&
            typeof source === 'object') {
            merge(target, source);
        }
    }
    return target;
}
const mergeExcludeArray = (target, source) => {
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
    return target;
};
export function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    if (sources.length === 1) {
        const source = sources[0];
        if (target &&
            typeof target === 'object' &&
            source &&
            typeof source === 'object') {
            return mergeExcludeArray(target, source);
        }
    }
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (target &&
            typeof target === 'object' &&
            source &&
            typeof source === 'object') {
            const a = mergeExcludeArray(target, source);
            if (a !== target) {
                target = a;
            }
        }
    }
    return target;
}
//# sourceMappingURL=deepMerge.js.map
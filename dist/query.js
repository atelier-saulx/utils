"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeQuery = exports.parseQuery = void 0;
const parseQueryValue = (q) => {
    if (q.includes(',')) {
        q = q.split(',');
        for (let i = 0; i < q.length; i++) {
            q[i] = parseQueryValue(q[i]);
        }
        return q;
    }
    if (q === 'null') {
        return null;
    }
    else if (q === 'true' || q === '') {
        return true;
    }
    else if (q === 'false') {
        return false;
    }
    else if (!isNaN(q)) {
        return Number(q);
    }
    return q;
};
exports.parseQuery = (query) => {
    if (query) {
        try {
            const r = {};
            let inMem = '';
            let inMemVal = '';
            let parseVal = false;
            let isJson = 0;
            const len = query.length;
            // len larger then 100 return?
            for (let i = 0; i < len; i++) {
                const q = query[i];
                if (q === '&' &&
                    (!isJson ||
                        (isJson === 1 && query[i - 1] === '}') ||
                        (isJson === 2 && query[i - 1] === ']'))) {
                    if (!parseVal) {
                        r[inMem] = true;
                    }
                    else if (isJson) {
                        try {
                            r[inMem] = JSON.parse(inMemVal);
                        }
                        catch (err) {
                            r[inMem] = inMemVal;
                        }
                    }
                    else {
                        r[inMem] = parseQueryValue(inMemVal);
                    }
                    // is json
                    isJson = 0;
                    parseVal = false;
                    inMem = '';
                    inMemVal = '';
                }
                else if (q === '=' && !isJson) {
                    parseVal = true;
                }
                else {
                    if (parseVal) {
                        // if empty
                        if (inMemVal === '') {
                            if (q === '{') {
                                isJson = 1;
                            }
                            else if (q === '[') {
                                isJson = 2;
                            }
                        }
                        inMemVal += q;
                    }
                    else {
                        inMem += q;
                    }
                }
            }
            if (inMem) {
                if (isJson) {
                    try {
                        r[inMem] = JSON.parse(inMemVal);
                    }
                    catch (err) {
                        r[inMem] = inMemVal;
                    }
                }
                else {
                    r[inMem] = parseQueryValue(inMemVal);
                }
            }
            return r;
        }
        catch (_e) { }
    }
};
const topLevelObject = (q) => {
    const args = [];
    for (const key in q) {
        const value = q[key];
        if (value === true) {
            args.push(`${key}`);
        }
        else {
            args.push(`${key}=${exports.serializeQuery(value, true)}`);
        }
    }
    return args.join('&');
};
exports.serializeQuery = (q, deep = false) => {
    if (typeof q === 'string') {
        return q;
    }
    if (typeof q === 'boolean') {
        return !q ? 'false' : 'true';
    }
    if (typeof q === 'number') {
        return String(q);
    }
    if (typeof q === 'number') {
        return String(q);
    }
    if (q === null) {
        return 'null';
    }
    if (Array.isArray(q)) {
        return q
            .map((v) => {
            if (typeof v === 'object' && v !== null) {
                return JSON.stringify(v);
            }
            return exports.serializeQuery(v, true);
        })
            .join(',');
    }
    if (typeof q === 'object') {
        if (deep) {
            return JSON.stringify(q);
        }
        return topLevelObject(q);
    }
    return '';
};
//# sourceMappingURL=query.js.map
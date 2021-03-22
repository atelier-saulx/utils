"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __importDefault(require("./hash"));
const stringHash_1 = __importDefault(require("./stringHash"));
const hashObject_1 = __importDefault(require("./hashObject"));
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const toString = (hash) => {
    let result = '';
    let mod;
    do {
        mod = hash % 62;
        result = chars.charAt(mod) + result;
        hash = Math.floor(hash / 62);
    } while (hash > 0);
    return result;
};
const hashCompact = (val, size) => {
    let result;
    if (typeof val === 'object') {
        if (val === null) {
            result = 0;
        }
        else {
            if (size && size > 9 && val.constructor === Array) {
                let str = '';
                const arraySize = val.length;
                for (let i = 0; i < arraySize; i++) {
                    str += toString(hash_1.default(val[i]));
                }
                const len = str.length;
                if (len < size) {
                    str += 'x';
                    if (len + 1 < size) {
                        str += new Array(size - len).join('0');
                    }
                }
                else if (len > size) {
                    return str.slice(0, size);
                }
                return str;
            }
            else {
                result = hashObject_1.default(val) >>> 0;
            }
        }
    }
    else {
        if (typeof val === 'boolean') {
            result = stringHash_1.default(val ? ':true' : ':false') * 4096;
        }
        else if (typeof val === 'number') {
            result = (stringHash_1.default('n:' + val) >>> 0) * 4096;
        }
        else {
            result = stringHash_1.default(val) >>> 0;
        }
    }
    let x = toString(result);
    const len = x.length;
    if (len < size) {
        x += 'x';
        if (len + 1 < size) {
            x += new Array(size - len).join('0');
        }
    }
    return x;
};
exports.default = hashCompact;
//# sourceMappingURL=hashCompact.js.map
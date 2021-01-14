"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const saulx_murmur_1 = require("saulx-murmur");
const hashObject_1 = __importDefault(require("./hashObject"));
const stringHash_1 = __importDefault(require("./stringHash"));
const hash = (val, size) => {
    if (val instanceof Buffer) {
        return saulx_murmur_1.murmurHash(val);
    }
    let result;
    if (typeof val === 'object') {
        if (val === null) {
            result = 0;
        }
        else {
            result = hashObject_1.default(val);
        }
    }
    else {
        if (typeof val === 'boolean') {
            result = (stringHash_1.default(val ? ':true' : ':false') >>> 0) * 4096;
        }
        else if (typeof val === 'number') {
            result =
                (stringHash_1.default('n:' + val) >>> 0) * 4096 +
                    (stringHash_1.default('n:' + val, 52711) >>> 0);
        }
        else {
            result = (stringHash_1.default(val) >>> 0) * 4096 + (stringHash_1.default(val, 52711) >>> 0);
        }
    }
    if (size) {
        const len = Math.ceil(Math.log10(result + 1));
        if (len < size) {
            return result * Math.pow(10, size - len);
        }
    }
    return result;
};
exports.default = hash;
//# sourceMappingURL=hash.js.map
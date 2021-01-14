"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stringHash_1 = __importDefault(require("./stringHash"));
// ignore key order
const hashObjectIgnoreKeyOrderNest = (obj, hash = 5381) => {
    if (obj.constructor === Array) {
        hash = stringHash_1.default('__len:' + obj.length + 1, hash);
        for (let i = 0; i < obj.length; i++) {
            const field = obj[i];
            const type = typeof field;
            if (type === 'string') {
                hash = stringHash_1.default(i + ':' + field, hash);
            }
            else if (type === 'number') {
                hash = stringHash_1.default(i + 'n:' + field, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = stringHash_1.default(i + 'v:' + 'null', hash);
                }
                else {
                    hash = stringHash_1.default(i + 'o:', hashObjectIgnoreKeyOrderNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = stringHash_1.default('b:' + (field ? 'true' : 'false'), hash) ^ i;
            }
        }
    }
    else {
        const keys = Object.keys(obj).sort();
        hash = stringHash_1.default('__len:' + keys.length + 1, hash);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const field = obj[key];
            const type = typeof field;
            if (type === 'string') {
                hash = stringHash_1.default(key + ':' + field, hash);
            }
            else if (type === 'number') {
                hash = stringHash_1.default(key + 'n:' + field, hash);
            }
            else if (type === 'object') {
                if (field === null) {
                    hash = stringHash_1.default(key + 'v:' + 'null', hash);
                }
                else {
                    hash = stringHash_1.default(key + 'o:', hashObjectIgnoreKeyOrderNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = stringHash_1.default(key + 'b:' + (field ? 'true' : 'false'), hash);
            }
        }
    }
    return hash;
};
exports.default = hashObjectIgnoreKeyOrderNest;
//# sourceMappingURL=hashObjectIgnoreKeyOrderNest.js.map
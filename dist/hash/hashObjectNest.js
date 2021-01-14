"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stringHash_1 = __importDefault(require("./stringHash"));
const hashObjectNest = (obj, hash = 5381) => {
    if (obj.constructor === Array) {
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
                    hash = stringHash_1.default(i + 'o:', hashObjectNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = stringHash_1.default(i + 'b:' + (field ? 'true' : 'false'), hash);
            }
        }
    }
    else {
        for (let key in obj) {
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
                    hash = stringHash_1.default(key + 'o:', hashObjectNest(field, hash));
                }
            }
            else if (type === 'boolean') {
                hash = stringHash_1.default(key + 'b:' + (field ? 'true' : 'false'), hash);
            }
        }
    }
    return hash;
};
exports.default = hashObjectNest;
//# sourceMappingURL=hashObjectNest.js.map
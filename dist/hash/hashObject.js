"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashObjectNest_1 = __importDefault(require("./hashObjectNest"));
const hashObject = (props) => {
    return (hashObjectNest_1.default(props) >>> 0) * 4096 + hashObjectNest_1.default(props, 52711);
};
exports.default = hashObject;
//# sourceMappingURL=hashObject.js.map
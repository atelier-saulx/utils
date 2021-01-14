"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashObjectIgnoreKeyOrderNest_1 = __importDefault(require("./hashObjectIgnoreKeyOrderNest"));
const hashObjectIgnoreKeyOrder = (props) => {
    return ((hashObjectIgnoreKeyOrderNest_1.default(props) >>> 0) * 4096 +
        (hashObjectIgnoreKeyOrderNest_1.default(props, 52711) >>> 0));
};
exports.default = hashObjectIgnoreKeyOrder;
//# sourceMappingURL=hashObjectIgnoreKeyOrder.js.map
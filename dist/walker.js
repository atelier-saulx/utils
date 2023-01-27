"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const defaultItemMatchFn = async (item) => _1.getType(item.ref) !== 'object';
const defaultListFn = async (target, previousPath) => {
    return Object.keys(target).map((key) => ({
        name: key,
        ref: target[key],
        path: [previousPath, key].filter(Boolean).join('/'),
        type: _1.getType(target[key]),
    }));
};
const defaultRecurseFn = async (item) => _1.getType(item.ref) === 'object';
const defaultTargetValidationFn = async (target) => _1.getType(target) === 'object';
exports.walk = async (target, itemFn, options) => {
    options = Object.assign({ listFn: defaultListFn, itemMatchFn: defaultItemMatchFn, recurseFn: defaultRecurseFn, targetValidationFn: defaultTargetValidationFn }, options);
    if (_1.getType(options.targetValidationFn) === 'function' &&
        !(await options.targetValidationFn(target)))
        return;
    ['listFn', 'itemMatchFn', 'recurseFn'].forEach((fn) => {
        if (_1.getType(options[fn]) !== 'function')
            throw new Error(fn + ' should be a function');
    });
    const items = await options.listFn(target, options.previousPath);
    await Promise.all(items.map(async (item) => {
        const { name, path, type } = item;
        if (await options.itemMatchFn(item)) {
            await itemFn(item.ref, { name, path, type });
        }
        if (await options.recurseFn(item)) {
            await exports.walk(item.ref, itemFn, Object.assign(Object.assign({}, options), { previousPath: item.path }));
        }
    }));
};
//# sourceMappingURL=walker.js.map
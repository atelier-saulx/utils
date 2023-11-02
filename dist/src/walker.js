import { getType } from './index.js';
const defaultItemMatchFn = async (item) => getType(item.ref) !== 'object';
const defaultListFn = async (target, previousPath) => {
    return Object.keys(target).map((key) => ({
        name: key,
        ref: target[key],
        path: [previousPath, key].filter(Boolean).join('/'),
        type: getType(target[key]),
    }));
};
const defaultRecurseFn = async (item) => getType(item.ref) === 'object';
const defaultTargetValidationFn = async (target) => getType(target) === 'object';
export const walk = async (target, itemFn, options) => {
    options = {
        listFn: defaultListFn,
        itemMatchFn: defaultItemMatchFn,
        recurseFn: defaultRecurseFn,
        targetValidationFn: defaultTargetValidationFn,
        ...options,
    };
    if (getType(options.targetValidationFn) === 'function' &&
        !(await options.targetValidationFn?.(target)))
        return;
    ['listFn', 'itemMatchFn', 'recurseFn'].forEach((fn) => {
        // @ts-ignore
        if (getType(options?.[fn]) !== 'function')
            throw new Error(fn + ' should be a function');
    });
    const items = await options?.listFn?.(target, options.previousPath);
    if (!items) {
        return;
    }
    await Promise.all(items.map(async (item) => {
        const { name, path, type } = item;
        if (await options?.itemMatchFn?.(item)) {
            await itemFn(item.ref, { name, path, type });
        }
        if (await options?.recurseFn?.(item)) {
            await walk(item.ref, itemFn, {
                ...options,
                previousPath: item.path,
            });
        }
    }));
};
//# sourceMappingURL=walker.js.map
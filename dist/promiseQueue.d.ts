export default function promiseQueue(promiseFn: <T>(...args: any[]) => Promise<T>, opts?: {
    concurrency?: number;
    memoize?: (...args: any[]) => any;
}): <T>(...args: any[]) => Promise<T>;

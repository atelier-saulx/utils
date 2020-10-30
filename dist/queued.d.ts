export default function queued<T, R>(promiseFn: (...args: any[]) => Promise<any>, opts?: {
    concurrency?: number;
    memoize?: (...args: any[]) => any;
}): <T>(...args: any[]) => Promise<any>;

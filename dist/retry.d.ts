/**
 * Retry the passed promise, with optional timeout.
 * @param promiseFn function that return the promise to execute
 * @param opts.timeout in ms, timeout between retries. Default = 100
 * @param opts.maxRetries maximum number of retries. Default = -1 (infinite)
 * @param `...args` variadic list of arguments for promiseFn
 */
export default function retry<T>(promiseFn: (...args: any[]) => Promise<T>, opts: {
    timeout: number;
    maxRetries: number;
}, ...args: any[]): Promise<T>;

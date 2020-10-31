declare function queued<K>(promiseFn: () => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): () => Promise<K>;
declare function queued<A, K>(promiseFn: (a?: A) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A) => Promise<K>;
declare function queued<A, B, K>(promiseFn: (a?: A, b?: B) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B) => Promise<K>;
declare function queued<A, B, C, K>(promiseFn: (a?: A, b?: B, c?: C) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C) => Promise<K>;
declare function queued<A, B, C, D, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D) => Promise<K>;
declare function queued<A, B, C, D, E, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<K>;
declare function queued<A, B, C, D, E, F, G, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G) => Promise<K>;
declare function queued<A, B, C, D, E, F, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F) => Promise<K>;
declare function queued<A, B, C, D, E, F, G, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G) => Promise<K>;
declare function queued<A, B, C, D, E, F, G, H, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H) => Promise<K>;
declare function queued<A, B, C, D, E, F, G, H, I, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I) => Promise<K>;
declare function queued<A, B, C, D, E, F, G, H, I, J, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I, j?: J) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I, j?: J) => Promise<K>;
export default queued;

export default function queued<A, B, C, D, E, F, G, H, I, J, K>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I, j?: J, k?: K) => Promise<K>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I, j?: J, k?: K) => Promise<K>;

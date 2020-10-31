export default function queued<A, B, C, D, E, F, G, H>(promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H) => Promise<H>, opts?: {
    concurrency?: number;
    dedup?: (...args: any[]) => number | string;
}): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H) => Promise<H>;

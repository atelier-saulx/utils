export declare const stringHash: (str: string, hash?: number) => number;
export declare const hashObjectIgnoreKeyOrderNest: (obj: object | any[], hash?: number) => number;
export declare const hashObjectNest: (obj: object | any[], hash?: number) => number;
export declare const hashObject: (props: object) => number;
export declare const hashObjectIgnoreKeyOrder: (props: object) => number;
export declare const hash: (val: any, size?: number) => number;
export declare const hashCompact: (val: any, size?: number) => string;

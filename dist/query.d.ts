declare type QueryValue = string | number | boolean;
declare type QueryParams = {
    [key: string]: QueryValue | QueryValue[] | {
        [key: string]: any;
    };
};
export declare const parseQuery: (query: string) => void | QueryParams;
export declare const serializeQuery: (q: string | number | boolean | QueryValue[] | {
    [key: string]: any;
}, deep?: boolean) => string;
export {};

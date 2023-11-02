type QueryValue = string | number | boolean | null;
type QueryParams = {
    [key: string]: QueryValue | QueryValue[] | {
        [key: string]: any;
    };
};
export declare const parseQuery: (query: string) => QueryParams | void;
export declare const serializeQuery: (q: QueryValue | QueryValue[] | {
    [key: string]: any;
}, deep?: boolean) => string;
export {};

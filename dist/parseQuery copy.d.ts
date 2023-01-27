declare type QueryValue = string | number | boolean;
declare type QueryParams = {
    [key: string]: QueryValue | QueryValue[] | {
        [key: string]: any;
    };
};
export declare const parseQuery: (query: string) => QueryParams | void;
export {};

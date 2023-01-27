export declare type OperandTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array' | 'null';
export declare const getType: (item: any) => OperandTypes;

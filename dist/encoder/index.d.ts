export declare const createEncoder: (chars: string[], encodeChars?: string[]) => {
    charMap: {
        [key: string]: string;
    };
    reverseCharMap: {
        [key: string]: string;
    };
    encode: (str: string) => string;
    decode: (str: string) => string;
};

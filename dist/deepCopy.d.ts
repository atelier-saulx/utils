declare const deepCopy: <T extends any[] | {
    [key: string]: any;
}>(a: T) => T;
export default deepCopy;

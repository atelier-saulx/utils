export type Path = (number | string)[];
export declare function setByPath(target: any, path: Path, value: any): any;
export declare const getByPath: (target: any, path: Path) => any;

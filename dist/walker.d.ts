import { OperandTypes } from './';
declare type RecurseFn<L> = (item: L) => Promise<boolean>;
export declare type WalkerListFn<L> = (target: any, previousPath?: string) => Promise<L[]>;
declare type ItemMatchFn<L> = (item: L) => Promise<boolean>;
declare type ListItem = {
    name: string;
    ref: any;
    path: string;
    type: OperandTypes;
};
export declare type WalkerTargetValidationFn = (target: any) => Promise<boolean>;
declare type ItemFn = (item: any, info: {
    name: string;
    path: string;
    type: OperandTypes;
}) => Promise<void>;
export declare type Walk<L = ListItem, F = ItemFn> = (target: any, itemFn: F, options?: {
    listFn?: WalkerListFn<L>;
    itemMatchFn?: ItemMatchFn<L>;
    recurseFn?: RecurseFn<L>;
    previousPath?: string;
    targetValidationFn?: WalkerTargetValidationFn;
}) => Promise<void>;
export declare const walk: Walk;
export {};

import { OperandTypes } from './';
type RecurseFn<L> = (item: L) => Promise<boolean>;
export type WalkerListFn<L> = (target: any, previousPath?: string) => Promise<L[]>;
type ItemMatchFn<L> = (item: L) => Promise<boolean>;
type ListItem = {
    name: string;
    ref: any;
    path: string;
    type: OperandTypes;
};
export type WalkerTargetValidationFn = (target: any) => Promise<boolean>;
type ItemFn = (item: any, info: {
    name: string;
    path: string;
    type: OperandTypes;
}) => Promise<void>;
export type Walk<L = ListItem, F = ItemFn> = (target: any, itemFn: F, options?: {
    listFn?: WalkerListFn<L>;
    itemMatchFn?: ItemMatchFn<L>;
    recurseFn?: RecurseFn<L>;
    previousPath?: string;
    targetValidationFn?: WalkerTargetValidationFn;
}) => Promise<void>;
export declare const walk: Walk;
export {};

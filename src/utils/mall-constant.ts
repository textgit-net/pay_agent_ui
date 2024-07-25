import {BaseSelectOption} from "~/utils/constant.ts";

/**
 * 商品状态
 */
export enum SPU_STATUS{
    /**
     * 上架
     */
    ON_SHELF=1,
    /**
     * 下架
     */
    OFF_SHELF=2,
    /**
     * 已售罄
     */
    SOLD_OUT=3
}

/**
 * 商品状态下柆框选项值
 */
export const SPU_STATUS_SELECT_OPTIONS:BaseSelectOption<number>[] = [
    {value: SPU_STATUS.ON_SHELF, name: '上架'},
    {value: SPU_STATUS.OFF_SHELF, name: '下架'},
    {value: SPU_STATUS.SOLD_OUT, name: '已售罄'}
];

/**
 * 库存计算方式
 */
export enum STOCK_MODE{
    /**
     * 下单扣减库存
     */
    CREATE_ORDER=1,
    /**
     * 支付扣减库存
     */
    PAY_ORDER=2
}

/**
 * 库存计算方式下柆框选项值
 */
export const STOCK_MODE_SELECT_OPTIONS:BaseSelectOption<number>[] = [
    {value: STOCK_MODE.CREATE_ORDER, name: '下单扣减库存'},
    {value: STOCK_MODE.PAY_ORDER, name: '支付扣减库存'},
];
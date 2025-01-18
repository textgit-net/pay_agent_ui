import {PageWarp, ResponseBody, BasePageRequest,PayChannelType} from "~/utils/constant.ts";
import { DateSearchTypeEnum } from '@/components/date-search-wrap/type'
import { DebtModeEnum, DebtStrategyEnum } from '@/api/channel/debt'
import { DebtAccountInfo} from '@/api/debt/account'
import { OrderStatus} from '@/api/order/OrderInterface'

export enum DebtOrderTableTypeEnum{
    ALL=1,
    //待处理
    WAIT_ING=2,
    //处理中
    PROCESS=3,
    //分账成功
    SUCCESS=4,
    //分账失败
    FAIL=5
}


export function getDebtOrderTableTypeEnumText(status:DebtOrderTableTypeEnum): string {
    switch (status){
        case DebtOrderTableTypeEnum.ALL:
            return "全部"
        case DebtOrderTableTypeEnum.WAIT_ING:
            return "待处理"
        case DebtOrderTableTypeEnum.PROCESS:
            return "处理中"
        case DebtOrderTableTypeEnum.SUCCESS:
            return "分账成功"
        case DebtOrderTableTypeEnum.FAIL:
            return "分账失败"
    }
}

export enum DebtOrderStatusEnum {
    /**
     * 待处理
     */
    WAIT_ING=1,
    /**
     * 处理中
     */
    PROCESS=2,
    /**
     * 分账成功
     */
    SUCCESS=3,
    /**
     * 分账失败
     */
    FAIL=4,
}

export function getDebtOrderStatusEnumText(status:DebtOrderStatusEnum): string {
    switch (status){
        case DebtOrderStatusEnum.WAIT_ING:
            return "待处理"
        case DebtOrderStatusEnum.PROCESS:
            return "处理中"
        case DebtOrderStatusEnum.SUCCESS:
            return "分账成功"
        case DebtOrderStatusEnum.FAIL:
            return "分账失败"
    }
}

export interface BaseDebtAccountOrderSearch extends BasePageRequest{
    startDate?: string
    endDate?: string
    // 为了回显
    dateType?: DateSearchTypeEnum
    status?: DebtOrderStatusEnum
    channelId?: string
    orderId?: string
    channelTypes?: PayChannelType[]
}

export interface DebtOrderAccountInfo extends DebtAccountInfo {
    channelTypeText?: string
    orderNo?: string
    rate?: number
}

export interface DebtSplitOrderInfo {
    account?: DebtOrderAccountInfo
    amount?: number
    createTime?: string
    errorMsg?: string
    finishTime?: string
    id?: string
    // 第三方订单号
    outOrderNo?: string
    rete?: number
    status?: OrderStatus
}

export interface DebtOrderInfo {
    amount?: number
    channelId?: number
    chanelName?: string
    createTime?: string
    finishTime?: string
    id?: string
    maxCompensateCount?: number
    orderAmount?: number
    orderId?: string
    royaltyMode?: DebtModeEnum
    royaltyRate?: number
    royaltyStrategy?: DebtStrategyEnum
    splitCount?: number
    status?: DebtOrderStatusEnum
    successAmount?: number
    totalRoyaltyAmount?: number
    items?: DebtSplitOrderInfo[]
    productCode?: string
}


/**
 * 分页查询分账订单列表
 * @param { DebtAccountRequset } params 
 * @returns {ResponseBody<PageWarp<DebtOrderInfo[]>>}
 */
export function getDebtAccountOrderList(params: BaseDebtAccountOrderSearch):Promise<ResponseBody<PageWarp<DebtOrderInfo>>>{
    return useGet<PageWarp<DebtOrderInfo>>('/royalty/order/search', params)
}


/**
 * 查询分账订单详情
 * @param { string } id 
 * @returns {ResponseBody<DebtOrderInfo>}
 */
export function getDebtAccountOrderInfo(id: string):Promise<ResponseBody<DebtOrderInfo>>{
    return useGet<DebtOrderInfo>('/royalty/order/info', {id})
}
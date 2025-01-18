import {
    BasePageRequest,
    PageWarp,
    PayChannelType,
    SelectOption,
} from "~/utils/constant.ts";
import { DateSearchTypeEnum } from '@/components/date-search-wrap/type'
export interface BaseOrderReportSearch extends BasePageRequest{
    startDate?:string
    endDate?:string
    // 为了回显
    dateType?: DateSearchTypeEnum
}

export enum TransOrderTableType{
    ALL=1,
    /**
     * 交易中
     */
    TRANS_ING=2,
    /**
     * 交易成功
     */
    SUCCESS=3,
    /**
     * 交易失败
     */
    FAIL=4,
}
export enum TransOrderStatus {
    /**
     * 交易中
     */
    TRANS_ING=1,
    /**
     * 交易成功
     */
    SUCCESS=2,
    /**
     * 交易失败
     */
    FAIL=3,
}


export function getTransOrderStatusText(status:TransOrderStatus): string {
    switch (status){
        case TransOrderStatus.TRANS_ING:
            return "交易中"
        case TransOrderStatus.SUCCESS:
            return "交易成功"
        case TransOrderStatus.FAIL:
            return "FAIL"
    }
}
export const  OrderStatusSelectOptions:SelectOption<TransOrderStatus>[]=[
    {
        value:TransOrderStatus.TRANS_ING,
        title:getTransOrderStatusText(TransOrderStatus.TRANS_ING)
    },
    {
        value:TransOrderStatus.SUCCESS,
        title:getTransOrderStatusText(TransOrderStatus.SUCCESS)
    }, 
    {
        value:TransOrderStatus.FAIL,
        title:getTransOrderStatusText(TransOrderStatus.FAIL)
    },
]


export interface TransOrderSearch extends BaseOrderReportSearch{
    // 渠道ID
    channelId?: string;
    // 商户订单号
    mchOrderNo?: string;
    // 渠道订单号
    channelOrderNo?: string;
    // 商户Id
    mchId?: string;
    // 代理Id
    agentId?: string;
    orderStatus?:TransOrderStatus[]
    orderNo?:string
    //支付方式
    payModes?:string[]
    channelTypes?:PayChannelType[]
    products?: string[]
}




export function searchChannelTransOrder(search:TransOrderSearch)   {
    return useGet<PageWarp<any>>("/channel/trans/out/order/page",search)
}

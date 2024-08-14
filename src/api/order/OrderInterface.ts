import {BasePageRequest, DateRange, PageWarp, PayChannelType, SelectOption, SignType} from "~/utils/constant.ts";
export interface BaseOrderReportSearch extends BasePageRequest{
    dateRange?:DateRange

}

export interface OrderReportSearch extends BaseOrderReportSearch{
    channels?:PayChannelType[]
    channelIds?:number[]
}
export enum OrderTableType{
    ALL=1,
    /**
     * 待支付
     */
    WAIT_PAY=2,
    /**
     * 支付中
     */
    PAY_ING=3,
    /**
     * 支付成功
     */
    SUCCESS=4,
    /**
     * 失败
     */
    FAIL=5
}
export enum OrderStatus {
    /**
     * 待支付
     */
    WAIT_PAY=1,
    /**
     * 支付中
     */
    PAY_ING=2,
    /**
     * 支付成功
     */
    SUCCESS=3,
    /**
     * 失败
     */
    FAIL=4,
    /**
     * 取消订单
     */
    CANCEL=5,
    /**
     * 订单关闭
     */
    CLOSE=6
}

export function getOrderStatusText(status:OrderStatus): string {
    switch (status){
        case OrderStatus.WAIT_PAY:
            return "待支付"
        case OrderStatus.PAY_ING:
            return "支付中"
        case OrderStatus.SUCCESS:
            return "支付成功"
        case OrderStatus.FAIL:
            return "失败"
        case OrderStatus.CANCEL:
            return "取消订单"
        case OrderStatus.CLOSE:
            return "订单关闭"
    }
}
export const  OrderStatusSelectOptions:SelectOption<OrderStatus>[]=[
    {
        value:OrderStatus.WAIT_PAY,
        title:getOrderStatusText(OrderStatus.WAIT_PAY)
    },
    {
        value:OrderStatus.PAY_ING,
        title:getOrderStatusText(OrderStatus.PAY_ING)
    },
    {
        value:OrderStatus.SUCCESS,
        title:getOrderStatusText(OrderStatus.SUCCESS)
    },
    {
        value:OrderStatus.FAIL,
        title:getOrderStatusText(OrderStatus.FAIL)
    },
    {
        value:OrderStatus.CANCEL,
        title:getOrderStatusText(OrderStatus.CANCEL)
    },
    {
        value:OrderStatus.CLOSE,
        title:getOrderStatusText(OrderStatus.CLOSE)
    }
]


export interface OrderSearch extends BasePageRequest{
    orderStatus?:OrderStatus[]
}




export function searchOrder(search:OrderSearch)   {
    return useGet<PageWarp<any>>("/order/page",search)
}
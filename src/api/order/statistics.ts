import {
    ResponseBody,
} from "~/utils/constant.ts";

export enum OrderStatisticsEnum {
    agent = 1,
    merchant = 2,
    channel = 3
}

export interface OrderStatisticsSearch {
    type?: OrderStatisticsEnum
    // 具体类型对应的id
    params?: string
}

export interface OrderStatisticsResponse {
    totalAmount?: number
    todayAmount?: number
    yesterdayAmount?: number
    totalCount?: number
    todayCount?: number
    yesterdayCount?: number
    totalSuccessCount?: number
    todaySuccessCount?: number
    yesterdaySuccessCount?: number
    totalFailCount?: number
    todayFailCount?: number
    yesterdayFailCount?: number
}


/**
 * 获取订单统计数据
 * @param search 查询参数
 */
export function getOrderStatisticsData(search:OrderStatisticsSearch):Promise<ResponseBody<OrderStatisticsResponse>>{
    return useGet<OrderStatisticsResponse>("/order/statistics", search)
}
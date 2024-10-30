import {ResponseBody } from "~/utils/constant.ts";

export enum OrderStatisticsEnum {
    total = 1,
    agent = 2,
    merchant = 3
}


export interface OrderStatisticsRequest {
    type: OrderStatisticsEnum,
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
 * 订单统计数据
 * @param params
 */
export function getOrderStatistics(params:OrderStatisticsRequest) :Promise<ResponseBody<OrderStatisticsResponse>> {
    return useGet<OrderStatisticsResponse>('/dashboard/orderStatistics', params)
}
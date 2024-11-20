import {
    BasePageRequest,
    ResponseBody,
    DateRange,
    PageWarp,
    PayModeType,
} from "~/utils/constant.ts";
import { DateSearchTypeEnum } from '@/components/date-search-wrap/type'

export interface BaseOrderReportSearch extends BasePageRequest{
    startDate?: string
    endDate?: string
    // 为了回响
    dateType?: DateSearchTypeEnum
    agentIds?: number []
    channelIds?: number []
    mchIds?: number []
    payModes?: string[]
}

export interface AllOrderReportSearch extends BaseOrderReportSearch{
   
}

export interface ChannelOrderReportSearch extends BaseOrderReportSearch{

}

export interface MerchantOrderReportSearch extends BaseOrderReportSearch{

}

export interface AgentOrderReportSearch extends BaseOrderReportSearch{

}

/**
 * 获取所有订单报表数据
 * @param search 查询参数
 */
export function getAllOrderReportData(search:AllOrderReportSearch):Promise<ResponseBody<PageWarp<any>>>{
    return useGet<PageWarp<any>>("/order/all/report", search)
}

/**
 * 获取渠道订单报表数据
 * @param search
 */
export function getChannelOrderReportData(search:ChannelOrderReportSearch):Promise<ResponseBody<PageWarp<any>>>{
    return useGet<PageWarp<any>>("/order/channel/report",search)
}

/**
 * 获取商户订单报表数据
 * @param search
 */
export function getMerchantOrderReportData(search:MerchantOrderReportSearch):Promise<ResponseBody<PageWarp<any>>>{
    return useGet<PageWarp<any>>("/order/mch/report",search)
}

/**
 * 获取代理商订单报表数据
 * @param search
 */
export function getAgentOrderReportData(search:AgentOrderReportSearch):Promise<ResponseBody<PageWarp<any>>>{
    return useGet<PageWarp<any>>("/order/agent/report",search)
}
import {
    BasePageRequest,
    PageWarp,
    ResponseBody,
    
} from "~/utils/constant.ts";


export interface AppProfitListItem {
    appId?: string,
    appName?: string,
    appIcon?: string,
    totalAmount?: number,
    totalTeamCommission?: number,
    totalPointsAmount?: number,
    totalCashAmount?: number,
    profit?: number,
}

export interface AppProfitSearchRequest extends BasePageRequest {
    appId?: string,
    'dateRange.startTime'?: string,
    'dateRange.endTime'?: string,
    date?: Array<string>
}

// 分页查询列表
export async function getAppProfit(params:AppProfitSearchRequest){
    return useGet<PageWarp<AppProfitListItem>>('/reportForms/appProfit',params)
}
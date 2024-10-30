import { ResponseBody, PayModeType} from "~/utils/constant.ts";

export interface PayModeRatesRequest {
    mchId?: string
    payMode?:PayModeType
    rates?: string
}

/**
 * 修改商户支付产品费率
 * @param { PayModeRatesRequest } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function updatePayModeRates(data: PayModeRatesRequest):Promise<ResponseBody<any>>{
    return usePost<any>('/mch/updatePayModeRates', data)
}

/**
 * 启用-禁用商户支付式
 * @param { PayModeRatesRequest } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function switchPayMode(data: PayModeRatesRequest):Promise<ResponseBody<any>>{
    return usePut<any>(`/mch/switchPayMode`, data)
}
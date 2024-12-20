import {PageWarp, ResponseBody, BasePageRequest} from "~/utils/constant.ts";
import { PayChannelType} from "~/utils/constant.ts";
import type { DebtAccountTypeEnum } from '@/api/channel/debt'
export interface DebtAccountInfo {
    id?: string
    realName?: string
    accountNo?:string
    channelType?:PayChannelType
    //	账户类型
    accountType?: DebtAccountTypeEnum,
}

export interface  DebtAccountRequset extends BasePageRequest {
    realName?: string
    accountNo?:string
    channelType?: PayChannelType
    //	账户类型
    accountType?: DebtAccountTypeEnum,
}



/**
 * 添加/修改分账账户
 * @param { AgemtInfo } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function modifyDebtAccount(data: DebtAccountInfo):Promise<ResponseBody<any>>{
    if (!data.id) {
        return usePost<any>('/royalty/account', data)
    }
    return usePut<any>('/royalty/account', data)
}

/**
 * 获取分页查询分账账户列表
 * @param { DebtAccountRequset } params 
 * @returns {ResponseBody<PageWarp<DebtAccountInfo[]>>}
 */
export function getDebtAccountList(params: DebtAccountRequset):Promise<ResponseBody<PageWarp<DebtAccountInfo>>>{
    return useGet<PageWarp<DebtAccountInfo>>('/royalty/account/search', params)
}

/**
 * 获取所有分账账户列表
 * @param { DebtAccountRequset } params 
 * @returns {ResponseBody<PageWarp<DebtAccountInfo[]>>}
 */
export function getAllDebtAccountList(params?: DebtAccountRequset):Promise<ResponseBody<DebtAccountInfo[]>>{
    return useGet<DebtAccountInfo[]>('/royalty/account/query', params)
}
import { ResponseBody, PayModeType,BasePageRequest,PageWarp} from "~/utils/constant.ts";

import { DateSearchTypeEnum } from '@/components/date-search-wrap/type'
export enum WallTypeEnum {
    transDeposit = 1
}


export interface WalletRecordInfo {
    id?: string
    bizType?: number
    bizNo?: string
    direction?: string
    amount?: number
    afterAmount?: number
    beforeAmount?: number
    walletType?: WallTypeEnum
    createTime?: string
    updateTime?: string
    
    remark?: string
}


export interface MchwalletRecordRequest extends BasePageRequest{
    startDate?:string
    endDate?:string
    // 为了回显
    dateType?: DateSearchTypeEnum
    wallType?: WallTypeEnum
    mchId?: string
    bizNo?: string
}

/**
 * 查询商户钱包流水记录
 * @param { MchwalletRecordRequest } data 
 * @returns {Promise<ResponseBody<PageWarp<ChannelWithdrawInfo>>>}
 */
export function getWalletRecord(data: MchwalletRecordRequest):Promise<ResponseBody<PageWarp<WalletRecordInfo>>>{
    return useGet<PageWarp<WalletRecordInfo>>('mch/wallet/record/page', data)
}
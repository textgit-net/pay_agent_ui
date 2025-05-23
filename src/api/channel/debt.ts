import { ResponseBody, BasePageRequest} from "~/utils/constant.ts";
import { PayChannelType} from "~/utils/constant.ts";
import { DebtAccountInfo } from "~/api/debt/account"

export enum DebtAccountTypeEnum {
    UID = 'UID',
    LOGIN_NAME = 'LOGIN_NAME',
    // OPEN_ID = 'OPEN_ID',
    // BANK_CARD = 'BANK_CARD'
}

export enum DebtModeEnum {
    POLLING = 'POLLING',
    FIXED_RATIO = 'FIXED_RATIO'
}

export enum DebtStrategyEnum {
    API = 'API',
    TRANSFER = 'TRANSFER',
    API_OR_TRANSFER = 'API_OR_TRANSFER'
}


export const getDebtAccountTypeEnumText = (state: DebtAccountTypeEnum) => {
    switch (state) {
        case DebtAccountTypeEnum.UID:
            return '支付宝UID';
        case DebtAccountTypeEnum.LOGIN_NAME:
            return '支付宝账户';
        // case DebtAccountTypeEnum.OPEN_ID:
        //     return 'OPEN_ID';
        // case DebtAccountTypeEnum.BANK_CARD:
        //     return '银行卡账户';
        default:
            return '未设置'
    }
}

export const getDebtModeEnumText = (state: DebtModeEnum) => {
    switch (state) {
        case DebtModeEnum.FIXED_RATIO:
            return '固定比率';
    
        case DebtModeEnum.POLLING:
            return '轮询';
        default:
            return '未设置'
    }
}


export const getDebtStrategyEnumText = (state: DebtStrategyEnum) => {
    switch (state) {
        case DebtStrategyEnum.API:
            return 'API';
        case DebtStrategyEnum.TRANSFER:
            return '转账';
        case DebtStrategyEnum.API_OR_TRANSFER:
            return 'API或转账';
        default:
            return '未设置'
    }
}

export interface ChannelDebtAccountRequest {
    id?: string
    channelId?: string
    accountId?: string
    rate?: number
    //排序序号，降序
    orderNo?:string
}

export interface ChannelDebtAccountConfig {
    channelId?: string
    //	是否启用分账
    isEnableRoyalty?: boolean
    //	分账比率(单位百分比)
    royaltyRate?: number
    // 	分账方式,可用值:POLLING,FIXED_RATIO
    royaltyMode?: DebtModeEnum
    // 	分账策略,可用值:API,TRANSFER,API_OR_TRANSFER
    royaltyStrategy?: DebtStrategyEnum
    //分账结算账户类型 API 或 API_OR_TRANSFER 需要
    settleAccountType?: DebtAccountTypeEnum
    // 渠道分账结算账户
    settleAccountNo?: string
    //分账失败是否自动关闭渠道
    isRoyaltyErrorAutoClose?: boolean
    //最大允许分账失败次数
    maxAllowRoyaltyFailCount?: number
    //APi最大分账比例
    maxApiRoyaltyAmountRate?: number

}

export interface AccountInfoItem {
    accountInfo?: DebtAccountInfo
    orderNo?: number
    rate?: number
    itemId?: string
}

export interface ChannelDebtConfigInfo extends ChannelDebtAccountConfig {
    accounts?: AccountInfoItem[]
}


/**
 * 添加/修改渠道分账账号
 * @param { ChannelDebtAccountRequest } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function modifyChannelDebtAccount(data: ChannelDebtAccountRequest):Promise<ResponseBody<any>>{
    if (!data.id) {
        return usePost<any>('/channel/royalty/account', data)
    }
    return usePut<any>('/channel/royalty/account', data)
}


/**
 * 删除渠道分账账号
 * @param { { channelId: string, itemIds: string} } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function delChannelDebtAccount(data: { channelId: string, itemIds: string}):Promise<ResponseBody<any>>{
    return useDelete<any>('/channel/royalty/account', data)
}

/**
 * 获取渠道分账配制
 * @param { string } id  id
 * @returns {ResponseBody<ChannelDebtAccountConfig>}
 */
export function getChannelDebtAccountConfig(id: string):Promise<ResponseBody<ChannelDebtAccountConfig>>{
    return useGet<ChannelDebtAccountConfig>(`/channel/royalty/config/${id}`)
}

/**
 * 更新渠道分账配制
 * @param { ChannelDebtAccountConfig } data
 * @returns {ResponseBody<any>}
 */
export function updateChannelDebtAccountConfig(data: ChannelDebtAccountConfig):Promise<ResponseBody<any>>{
    return usePut<any>(`/channel/royalty/config`, data)
}
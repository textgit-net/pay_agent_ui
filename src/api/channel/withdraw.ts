import {PageWarp, ResponseBody, BasePageRequest} from "~/utils/constant.ts";
import { DateSearchTypeEnum } from '@/components/date-search-wrap/type'
import { DebtModeEnum, DebtStrategyEnum } from '@/api/channel/debt'

export enum ChannelWithdrawTableTypeEnum{
    //全部
    ALL=0,
    //审核中
    AUDIT=1,
    //处理中
    PROCESS=2,
    //转账中
    TRANSFER=3,
    //审核成功
    SUCCESS=4,
    //转账失败
    TRANSFER_FAIL=5,
    //审核驳回
    AUDIT_REJECT=6
}


export function getChannelWithdrawTableTypeEnumText(status:ChannelWithdrawTableTypeEnum): string {
    switch (status){
        case ChannelWithdrawTableTypeEnum.ALL:
            return "全部"
        case ChannelWithdrawTableTypeEnum.AUDIT:
            return "审核中"
        case ChannelWithdrawTableTypeEnum.PROCESS:
            return "处理中"
        case ChannelWithdrawTableTypeEnum.TRANSFER:
            return "转账中"
        case ChannelWithdrawTableTypeEnum.SUCCESS:
            return "转账成功"
        case ChannelWithdrawTableTypeEnum.TRANSFER_FAIL:
            return "转账失败"
        case ChannelWithdrawTableTypeEnum.AUDIT_REJECT:
            return "审核驳回"
    }
}

export enum ChannelWithdrawStatusEnum {
    //审核中
    AUDIT=1,
    //处理中
    PROCESS=2,
    //转账中
    TRANSFER=3,
    //审核成功
    SUCCESS=4,
    //转账失败
    TRANSFER_FAIL=5,
    //审核驳回
    AUDIT_REJECT=6
}

export function getChannelWithdrawStatusEnumText(status:ChannelWithdrawStatusEnum): string {
    switch (status){
        case ChannelWithdrawStatusEnum.AUDIT:
            return "审核中"
        case ChannelWithdrawStatusEnum.PROCESS:
            return "处理中"
        case ChannelWithdrawStatusEnum.TRANSFER:
            return "转账中"
        case ChannelWithdrawStatusEnum.SUCCESS:
            return "转账成功"
        case ChannelWithdrawStatusEnum.TRANSFER_FAIL:
            return "转账失败"
        case ChannelWithdrawStatusEnum.AUDIT_REJECT:
            return "审核驳回"
    }
}

export interface ChannelWithdrawSearch extends BasePageRequest{
    startDate?: string
    endDate?: string
    // 为了回显
    dateType?: DateSearchTypeEnum
    status?: ChannelWithdrawStatusEnum
    channelId?: string
    //申请人Id
    applyBy?: string
    //收款账号
    accountNo?: string
}

export interface ChannelWithdrawAuditRequest {
    isPass?: boolean
    securityCode?: string
    remark?: string
    ids?: string[]
}

export interface ChannelWithdrawRequest {
    accountNo?: string
    realName?: string
    amount?: number
    securityCode?: string
    remark?: string
    channelId: number
}


export interface ChannelWithdrawInfo {
    amount?: number
    channelId?: number
    channelName?: string
    createTime?: string
    updateTime?: string
    id?: string
    //提现发起人id
    applyBy?: number;
    applyByName?: string;
    isNeedAudit?: boolean;
    //审核人id
    lastAuditBy?: number;
    lastAuditByName?: string;
    lastAuditRemark?: string;
    lastAuditTime?: string;
    status?:ChannelWithdrawStatusEnum;
    withdrawFee?: number;
    withdrawRates?: number;
    transferOutNo?: string;
    transferError?: string;
    transferFinishTime?: string;
    // 提现备注
    remark?: string
}


/**
 * 分页-查询渠道提现记录
 * @param { DebtAccountRequset } params 
 * @returns {ResponseBody<PageWarp<ChannelWithdrawInfo[]>>}
 */
export function getChannelWithdrawRecord(params: ChannelWithdrawSearch):Promise<ResponseBody<PageWarp<ChannelWithdrawInfo>>>{
    return useGet<PageWarp<ChannelWithdrawInfo>>('/channel/withdraw/record', params)
}


/**
 * 渠道提现审核
 * @param { ChannelWithdrawAuditRequest } data 
 * @returns {ResponseBody<any>}
 */
export function postChannelWithdrawAudit(data: ChannelWithdrawAuditRequest):Promise<ResponseBody<any>>{
    return usePost<any>('/channel/withdraw/audit', data)
}


/**
 * 渠道账户余额提现
 * @param { ChannelWithdrawRequest } data 
 * @returns {ResponseBody<any>}
 */
export function postChannelWithdraw(data: ChannelWithdrawRequest):Promise<ResponseBody<any>>{
    return usePost<any>('/channel/withdraw', data)
}
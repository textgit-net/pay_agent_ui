import { BasePageRequest, CompanyAccountType, PageWarp, SelectOption } from "~/utils/constant.ts";
export interface CompanyAccount {
    userName?: string
    password?: string
    type?: CompanyAccountType
}
export interface CompanyInfo {
    id?: number
    name?: string
    domain?: string
    domainSerial?: string
    domainRegisterPlatform?: string
    qualificationCert?: string
    qualificationType?: number
    qualificationSerial?: string
    accounts: CompanyAccount[]
    legalPerson?: string
    phone?: string
    balanceAmount?: number
    commissionAmount?: number
    earnestAmount?: number
}

export interface CompanyFormInfo extends CompanyInfo {

}


export interface CompanySearch extends BasePageRequest {
    // accountType?:string
    name?:string
}

export async function searchCompany(params: CompanySearch) {
    return useGet<PageWarp<CompanyInfo>>('/company/search', params)
}

export async function saveCompany(data: CompanyFormInfo) {
    if (data.id) {
        return usePut<string>("/company", data)
    }
    return usePost<string>("/company", data)
}

export async function getCompanyInfo(id: number) {
    return useGet<CompanyInfo>(`/company/${id}`)
}

export async function removeCompanyWithId(id: number) {
    return useDelete<string>(`/company/${id}`)
}


export async function getCompanySelectOption() {
    return useGet<SelectOption<number>[]>("/company/selectOption")
}


export interface getRechargeRecord {
    accountType?: number
    amount?: number
    companyId?: number
    createTime?: string
    id?: number
    rechargeMode?: number
    status?: number
    statusText?: string
    updateTime?: string
    rechargeModeText?: string
    accountTypeText?: string
    companyName?: string
}

export interface AccountRechargeRecord extends BasePageRequest {
    companyName?: string,
    status?: number
}

/**
 * 获取账户充值记录
 */

export function fetchAccountRechargeRecord(params: AccountRechargeRecord) {
    return useGet<getRechargeRecord>(`/company/wallet/recharge/record`, params)
}


export interface AuditAccount {
    isPass:boolean
    remark?:string
    id?:string
    bizNo?:string
    bizType?:string
}



// 审核接口
export function AuditAccountRecharge(params: AuditAccount) {
    return usePost(`/company/wallet/recharge/audit`, params)
}

// 业务类型
export enum accountBizType {
    // 1.转账
    transfer = 1,
    // 3.在线充值
    OnlineRecharge = 3,
    // 4.后台充值
    backstage = 4,
    // 5.提现
    withdrawDeposit = 5,
    // 6.渠道支付
    channelPay = 6
}

export const getaccountBizType=(type:accountBizType)=>{
    switch (type){
        case accountBizType.transfer:
            return "转账"
        case accountBizType.OnlineRecharge:
            return "在线充值"
        case accountBizType.backstage :
            return "后台充值"
        case accountBizType.withdrawDeposit:
            return "提现"
        case accountBizType.channelPay:
            return "渠道支付"
    }
}

export enum accountTypeSearch {
// 1.余额 
balance=1,
// 2.保证金
earnest=2,
// 3.佣金
commission=3
}

export const SearchByaccountType=(type:accountTypeSearch)=>{
switch (type){
    case accountTypeSearch.balance:
        return "余额"
    case accountTypeSearch.earnest:
        return "保证金"
    case accountTypeSearch.commission :
        return "佣金"
}
}
// 获取账户流水
// 返回的数据类型定义
export interface getAccountStatement {
    companyId?: number
    companyName?: string
    createDate?: string
    createTime?: string
    direction?: string
    remark?: string
    accountBizTypeText?: string
    beforeAmount?: number
    afterAmount?: number
    accountBizNo?: string
    accountTypeText?: string
    amount?: number
    accountType?: string
    id?: string
}

export interface dateRange {
    startTime?:string[]
    endTime?:string[]
}


export interface AccountStatementSearch extends BasePageRequest {
    companyId?: string
    bizNo?: string
    accountType?: string
    bizType?: string
    // createDate?:string[]
    ['dateRange.startTime']?: string
    ['dateRange.endTime']?: string
    
}


/**
 * 获取账户流水
 */

export function seachAccountStatement(params:AccountStatementSearch ) {
    return useGet<getAccountStatement>(`/company/wallet/record`, params)
}
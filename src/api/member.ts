import { CascaderProps } from 'ant-design-vue';
import {
    BasePageRequest,
    PageWarp,
    ResponseBody,
    
} from "~/utils/constant.ts";
import { ContentTypeEnum, RequestEnum } from '~#/http-enum'

export enum WalletTypeEnum {
    integral = 1,
    commission = 2,
    cash = 3,
    rewardCash = 4
}

export interface BizTypeEnumOptItem {
    label?: string,
    value?: number,
}

export interface AppInfoWallet {
    id?: string,
    name?: string,
    icon?: string,
    amount?: number,
    freezeAmount?: number,
    totalAmount?: number,
}

export interface AppInfoWalletRequest {
    userId: string,
    type: WalletTypeEnum
}

export function getWalletTypeEnumText(type: WalletTypeEnum):string {
    switch (type) {
        case WalletTypeEnum.integral:
            return '积分';
        case WalletTypeEnum.cash:
            return '红包';
        case WalletTypeEnum.commission:
            return '佣金';
        case WalletTypeEnum.rewardCash:
            return '激励红包';
    }
}

export interface MemberSearchRequest extends BasePageRequest{
    phone?:string
}

export interface UserInfo {
    id?: number,
    nickName?: string,
    phone?: string,
    avatar?: string;
    gender?: string,
    isAgent?: boolean,
    registerTime?: string,
    teamCommissionRates?: number,
    teamTotalCount?: number,
    pointsAmount?: number,
    pointsExchangeAmount?: number,
    commissionAmount?: number,
    commissionExchangeAmount?: number,
    cashAmount?: number,
    cashExchangeAmount?: number,
    status?: number,
    isAllowRewardAdTask?: boolean,
    isAllowRewardTask?: boolean,
    isAllowWithdraw?: boolean,
    isUnlimitedWithdrawAmount?: boolean,
    isWithdrawWhitelist?: boolean
    appId?: null,
    appIcon?: null,
    appName?: null,
    birthday?: null,
    shareBy?: ShareByInfo,
    isEnable?: boolean
}

export interface ShareByInfo {
    avatar?: string;
    id?: string;
    nickName?: string;
    phone?: string;
    level?: number;
}

export interface MemberListItem extends UserInfo  {
}

export interface MemberWalletItem {
    id?: string,
    amount?: number,
    afterAmount?: number,
    beforeAmount?: number,
    exchangeAmount?: number,
    exchangeBeforeAmount?: number,
    exchangeAfterAmount?: number,
    direction?: string,
    applicationName?: string,
    applicationIcon?: string,
    nickName?: string,
    phone?: string,
    remark?: string,
    userId?: string,
    walletType?: number,
}

export interface MemberWalletRecordSearchParams extends BasePageRequest {
    userId: string,
    bizType?: string,
    appId?: string,
    walletType: WalletTypeEnum,
    'dateRange.startTime'?: string,
    'dateRange.endTime'?: string,
    date?: Array<string>
}

// 分页查询列表
export async function getMemberList(params:MemberSearchRequest){
    return useGet<PageWarp<MemberListItem>>('/member/search',params)
}

// 获取用户钱包列表  ---参数
export async function getWalletList(){
    return useGet('/member/wallet/list',)
}

// 获取用户每日收益排行榜
export async function getDailyIncomeRanking(params){
    return useGet('/member/dailyIncomeRanking',params)
}



// 获取用户设备安装信息
export async function getMemberDeviceApps(params){
    return useGet('/member/device/apps',params)
}



// 获取用户登录的设备列表
export async function getMemberDeviceList(params){
    return useGet('/member/device/list',params)
}


// 获取用户详情
export async function getMemberInfo(id){
    return useGet(`/member/info/${id}`)
}


// 回收用户代理权限
export async function recycleAgent(params: {userId: string}){
    return usePut('/member/recycleAgent',{}, params,)
}

// 获取用户团队 关系链

export async function getMemberChain(params){
    return useGet('/member/team/chain',params)
}

// 修改代理团队佣金比率

export async function teamCommissionRates(data){
    return usePut('/member/update/teamCommissionRates',data)
}


// 提升用户为代理
export async function upgradeAgent(data){
    return usePut('/member/upgradeAgent',data)
}

// 获取钱包流水
export async function getMemberWalletRecord(params: MemberWalletRecordSearchParams){
    return useGet<PageWarp<MemberWalletItem>>('/member/wallet/record', params)
}

// 1.用戶狀態 2.激励广告任务 3.悬赏任務 4.用户提现 5.自由提現
export const changeStatus = (params) => {
    return useGet('/member/changeStatus',params,)
}

 
/**
 * 业务类型枚举
 * @param request
 */
export async function getBizTypeEnum(){
    return useGet<BizTypeEnumOptItem[]>("/member/getBizTypeEnum",)
}


 
/**
 * 应用钱包搜索条件
 * @param request
 */
export async function getAppInfoWalletList(params: AppInfoWalletRequest){
    return useGet<AppInfoWallet[]>("member/appInfo/list", params)
}
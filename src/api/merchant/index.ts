import {PageWarp, ResponseBody, BasePageRequest, ContactWay, PayModeType} from "~/utils/constant.ts";
import {AgentInfo} from "~/api/agent";

export interface ProductRateItem {
    isEnable?: boolean
    // isDisable?: boolean
    productCode?: string
    productName?:string
    rates?:number
}

export interface PayChannelInfo {
   
    channelType?: string
    channelTypeName?: string
    payModes?: string[]
    // ratesConfig?: ChannelRatesConfig
}

export interface MerchantInfo {
    id?: string
    agentId?: number
    name?:string
    contactName?:string
    contactNumber?: string
    contactWay?: ContactWay
    isEnable?: boolean
    remark?: string
    loginName?: string
    password?: string
    isResetPassword?: boolean
    agentInfo?: AgentInfo,
    products?: ProductRateItem[],
    totalOrderAmount?: number
    totalOrderCount?: number
    //可用金额
    amount?: number
    // 冻结金额
    freezeAmount?: number
    // 用于加载动画
    isItemLoadSpinning?: boolean
}

export interface MerchantInfoRequest extends MerchantInfo  {

}

export interface MerchantRequest extends BasePageRequest {
    // ID/名称/简称
    keywords?: string
    agentId?: number
}

export interface MerchantPageSearch {
    // ID/名称/简称
    keyword?: string
}

export interface MerchantResetPwdRequset  {
    targetId?: string
    password?:string
    confirmPassword?: string
    isDefaultPwd?:boolean
}

export interface MerchantOptItem {
    id?: string;
    name?: string;
    shortName?: string;
}


/**
 * 添加/修改商户
 * @param { AgemtInfo } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function modifyMerchant(data: MerchantInfoRequest):Promise<ResponseBody<any>>{
    if (!data.id) {
        return usePost<any>('/mch', data)
    }
    return usePut<any>('/mch', data)
}


/**
 * 启用-禁用商户
 * @param { string } id 
 * @returns {Promise<ResponseBody<any>>}
 */
export function changeMchEnable(id: string):Promise<ResponseBody<any>>{
    return useGet<any>(`/mch/changeEnable/${id}`)
}


/**
 * 获取全部商户列表
 * @param { MerchantPageSearch } params 
 * @returns {ResponseBody<MerchantOptItem[]>}
 */
export function getAllMerchantList(params?: MerchantPageSearch):Promise<ResponseBody<MerchantOptItem[]>>{
    return useGet<MerchantOptItem[]>('/mch/query', params)
}

/**
 * 获取商户列表
 * @param { AgentPageReq } params 
 * @returns {ResponseBody<PageWarp<any>>}
 */
export function getMerchantList(params: MerchantRequest):Promise<ResponseBody<PageWarp<any>>>{
    return useGet<PageWarp<any>>('/mch/page', params)
}


/**
 * 获取商户信息
 * @param { string } id 
 * @returns {Promise<ResponseBody<MerchantInfo>>}
 */
export function getMerchantInfo(id: string):Promise<ResponseBody<MerchantInfo>>{
    return useGet<MerchantInfo>(`/mch/info/${id}`)
}

/**
 * 删除商户
 * @param { string } id 
 * @returns {Promise<ResponseBody<MerchantInfo>>}
 */
export function delMerchant(id: string):Promise<ResponseBody<MerchantInfo>>{
    return useDelete<MerchantInfo>(`/mch/${id}`)
}


/**
 * 重置商户登录密码
 * @param { MerchantResetPwdRequset } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function resetMerchantPwd(data: MerchantResetPwdRequset):Promise<ResponseBody<any>>{
    return usePut<any>(`/mch/resetPwd`, data)
}
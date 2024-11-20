import {PageWarp, ResponseBody, BasePageRequest, ContactWay} from "~/utils/constant.ts";

export enum AllowInviteUserEnum {
    notAllow = 0,
    allow = 1
}


export interface PayChannelInfo {
   
    channelType?: string
    channelTypeName?: string
    payModes?: string[]
    // ratesConfig?: ChannelRatesConfig
}

export interface AgentInfo {
    id?: string
    name?:string
    shortName?:string
    contactName?:string
    contactNumber?: string
    contactWay?: ContactWay
    mchCount?: number;
    childAgentCount?: number;
    isAllowInviteUser?: AllowInviteUserEnum
    isEnable?: boolean
    remark?: string
    loginName?: string
    password?: string
    payChannelConfig?: PayChannelInfo[]
    totalOrderAmount?: number
    totalOrderCount?: number
}

export interface AgentInfoReq extends AgentInfo  {

}

export interface AgentResetPwdRequset  {
    targetId?: string
    password?:string
    securityCode?: string
    confirmPassword?: string
    isDefaultPwd?:boolean
}

export interface AgentPageSearch {
    // ID/名称/简称
    keyword?: string
}

export interface AgentOptItem {
    id?: string;
    name?: string;
    shortName?: string;
}


export interface AgentPageReq extends BasePageRequest,AgentPageSearch {
  
}


/**
 * 添加/修改代理
 * @param { AgemtInfo } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function modifyAgent(data: AgentInfoReq):Promise<ResponseBody<any>>{
    if (!data.id) {
        return usePost<any>('/agent', data)
    }
    return usePut<any>('/agent', data)
}

/**
 * 获取代理列表
 * @param { AgentPageReq } params 
 * @returns {ResponseBody<PageWarp<any>>}
 */
export function getAgentList(params: AgentPageReq):Promise<ResponseBody<PageWarp<any>>>{
    return useGet<PageWarp<any>>('/agent/page', params)
}

/**
 * 获取全部代理列表
 * @param { AgentPageReq } params 
 * @returns {ResponseBody<PageWarp<any>>}
 */
export function getAllAgentList(params?: AgentPageSearch):Promise<ResponseBody<AgentOptItem[]>>{
    return useGet<AgentOptItem[]>('/agent/query', params)
}


/**
 * 获取代理信息
 * @param { string } id 
 * @returns {Promise<ResponseBody<AgentInfo>>}
 */
export function getAgentInfo(id: string):Promise<ResponseBody<AgentInfo>>{
    return useGet<AgentInfo>(`/agent/${id}`)
}



/**
 * 重置代理商登录密码
 * @param { AgentResetPwdRequset } data 
 * @returns {Promise<ResponseBody<any>>}
 */
export function resetAgentPwd(data: AgentResetPwdRequset):Promise<ResponseBody<any>>{
    return usePut<any>(`/agent/resetPwd`, data)
}


/**
 * 启用-禁用代理商
 * @param { string } id 
 * @returns {Promise<ResponseBody<any>>}
 */
export function changeAgentEnable(id: string):Promise<ResponseBody<any>>{
    return useGet<any>(`/agent/changeEnable/${id}`)
}
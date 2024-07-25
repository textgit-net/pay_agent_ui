import {MediationNetworkType} from "~/utils/constant.ts";
import {NetworkResponse} from "~/api/network.ts";
export interface MediationSiteNetwork{
    id:number
    targetAppId:string
    network:NetworkResponse
}
export  interface MediationSiteNetworkFrom{
    appId?:string
    siteId?:number
    networkId?:number
    id?:number
}
export  interface MediationSiteNetworkSearch{
    siteId:number
}
export  interface MediationSiteNetworkListResponse{
    id:number
    siteId:number
    networkType:MediationNetworkType
}

export async function getMediationSiteNetworkList(siteId?:number){
    return useGet<MediationSiteNetworkListResponse[]>("/mediation/site/network/list",{siteId:siteId})
}

/**
 * 保存应用广告网络配制
 * @param request
 */
export async function saveMediationSiteNetwork(request:MediationSiteNetworkFrom){
    return usePost<string>("/ad/site/network",request)
}
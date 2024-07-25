import {BasePageRequest, MediationNetworkType, PageWarp} from "~/utils/constant.ts";
import {CompanyInfo} from "~/api/company.ts";
import { NetworkType } from "@vueuse/core";

export interface NetworkAccount{
    userId?:string
    roleId?:string
    securityKey?:string
    accessKey?:string
    privateKey?:string
    organizationCoreId?:string
    apiKey?:string
    publicKey?:string
    userName?:string
}

export  interface NetworkResponse extends NetworkFrom{
    id?:number
    company?:CompanyInfo
    networkTypeName?:string
    isEnableReportApi:boolean
    name:string
}
export  interface NetworkInfo extends NetworkResponse{
    isEnable:boolean
    accountConfig?:NetworkAccount
}
export  interface NetworkFrom{
    companyId?:number
    accountConfig?:NetworkAccount
    id?:number
    company?:CompanyInfo
    type?:MediationNetworkType
    isEnableReportApi:boolean
    name:string
}


export  interface NetworkSearch extends BasePageRequest{
    companyId?:number
    networkType?:number
    appId?:number
    ignoreNetworkTypes?:string
}

export async function saveNetwork(data:NetworkFrom){
    if(data.id){
        return usePut<string>("/ad/network",data)
    }
    return usePost<string>("/ad/network",data)
}


export async function searchNetwork(params:NetworkSearch){
    return useGet<PageWarp<NetworkInfo>>("/ad/network/search",params)
}

export async function getNetworkList(params:NetworkSearch){
    return useGet<NetworkResponse[]>("/ad/network/list",params)
}

export async function getNetworkInfo(id:number){
    return useGet<NetworkInfo[]>(`/ad/network/info/${id}`)
}

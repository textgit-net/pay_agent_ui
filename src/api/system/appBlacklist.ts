import { ApplicationBlacklistSearch } from './appBlacklist';
import {BasePageRequest, ClientPlatform, PageWarp} from "~/utils/constant.ts";
import {ApplicationInfo} from "~/api/application.ts";

export  interface ApplicationBlacklistInfo{
    id?:number
    packageName?:string
    name?:string
    icon?:string
    createTime?:string
}

export interface ApplicationBlacklistSearch extends BasePageRequest{
    name?:string
    clientPlatform:ClientPlatform
}

/**
 * 查询黑名单应用列表
 * @param search
 */
export async function fetchAppBlacklist(search:ApplicationBlacklistSearch){
    return useGet<PageWarp<ApplicationInfo>>(`/system/${search.clientPlatform==ClientPlatform.ANDROID?"android":"ios"}/blacklist/app`,search)
}
export interface AddBlackAppRequset{
    name?:string,
    packageName?:string,
    clientPlatform?:string
} 

// 添加应用

export async function addBlackApp(data:AddBlackAppRequset){
    return usePost(`/system/blacklist/app`,data)
}

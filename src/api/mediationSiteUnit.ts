import {BasePageRequest, MediationSiteCodeType, MediationSiteStatus, PageWarp} from "~/utils/constant.ts";
import {AdReport} from "~/api/bean.ts";
import {MediationUnitSegmentResponse} from "~/api/mediationUnitSegment.ts";
export interface MediationUnitListResponse{
    id?:number
    appId?:number
    companyId?:number
    siteId?:number
    name?:string
    type?:MediationSiteCodeType
    typeText?:string
    status?:MediationSiteStatus
    statusText?:string
    securityKey?:string
    isNeedServiceVerify?:boolean
    createTime?:string
    updateTime?:string
}
/**
 * 广告单元
 */
export interface MediationUnitResponse extends MediationUnitListResponse, AdReport{

}

export interface MediationUnitInfoResponse extends MediationUnitListResponse{
    segments:MediationUnitSegmentResponse[]
}
/**
 * 广告单元查询参数
 */
export interface  MediationUnitSearch extends BasePageRequest{
    siteId:number
    codeType?:MediationSiteCodeType
    startTime?:string
    endTime?:string
}

export interface CreateMediationUnitFrom{
    name?:string
    type?:MediationSiteCodeType
    securityKey?:string,
    isNeedServiceVerify:boolean
}


export interface UpdateMediationUnitFrom{
    id?:number
    name?:string
    securityKey?:string,
    isNeedServiceVerify:boolean
}

/**
 * 获取广告单元列表
 * @param search
 */
export async function getMediationUnitList(search:MediationUnitSearch) {
    return useGet<MediationUnitListResponse[]>("/mediation/unit/list",search)
}

/**
 * 查询广告单元列表
 * @param search
 */
export async function  searchMediationUnit(search:MediationUnitSearch){
    return useGet<PageWarp<MediationUnitResponse>>("/mediation/unit/search",search)
}

export async function getMediationUnitInfo(id:string){
    return useGet<MediationUnitInfoResponse>(`/mediation/unit/${id}`)
}

/**
 * 创建广告单元
 * @param request
 */
export async function createMediationUnit(request:any){
    return usePost<String>("/mediation/unit",request)
}

/**
 * 更新广告单元
 * @param request
 */
export async function updateMediationUnit(request:UpdateMediationUnitFrom){
    return usePut<String>("/mediation/unit",request)
}

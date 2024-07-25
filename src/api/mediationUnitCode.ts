import {AdReport} from "~/api/bean.ts";
import {MediationNetworkType, MediationSiteCodeType} from "~/utils/constant.ts";

export async function saveMediationUnitCode(data: CreateMediationUnitCodeRequest){
    return usePost<string>(`/mediation/site/unit/code`, data)
}

export async function updateMediationUnitCode(data:UpdateMediationUnitCodeRequest){
    return usePut<string>(`/mediation/site/unit/code`, data)
}

export enum ExperimentGroupType{
    A=1,
    B=2
}
export  enum MediationCodeSortType{
    PRICE=1,
    BID=2,
    BOTTOM_UP=3
}
export interface MediationUnitCodeResponse extends AdReport{
    id:number
    name?:string
    segmentId:number
    siteId:number
    unitId:number
    siteNetworkId:number
    storeNo:number
    experimentGroupType:ExperimentGroupType
    networkType:MediationNetworkType
    networkTypeText:string
    codeType:MediationSiteCodeType
    codeId:string
    isEnable:boolean
    sortType:MediationCodeSortType
    sortPrice?:number
    smartSortSwitch?:boolean
    smartSortEffectiveStatus?:boolean
    smartSortFetchDays?:number
    smartSortIneffectiveReason?:number
}


export interface CreateMediationUnitCodeRequest{
    segmentId?:number
    siteId?:number
    unitId?:number
    networkId?:number
    codeType?:MediationSiteCodeType
    code?:string
    codeName?:string
    isEnable:boolean
    sortType?:MediationCodeSortType
    sortPrice?:number
    smartSortSwitch?:boolean
    smartSortEffectiveStatus?:boolean
    smartSortFetchDays?:number
    smartSortIneffectiveReason?:number
}


export interface UpdateMediationUnitCodeRequest{
    id?:number
    code?:string
    codeName?:string
    isEnable?:boolean
}
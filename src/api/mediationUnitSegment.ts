import {MediationUnitCodeResponse} from "~/api/mediationUnitCode.ts";
import {AdReport} from "~/api/bean.ts";
import {MediationUnitWaterfallResponse} from "~/api/mediationUnitWaterfall.ts";
import {MediationNetworkType} from "~/utils/constant.ts";

export interface MediationUnitSegmentResponse{
    id:number
    name:number
    siteId:number
    isDefault:boolean
    orderNo:number
    rules:string
    isEnable:boolean
}

export interface MediationUnitSegmentInfoResponse extends MediationUnitSegmentResponse{
    codeList:MediationUnitCodeResponse[]
    summaryReport?:AdReport
    waterfall?:MediationUnitWaterfallResponse
}


export async function getMediationUnitSegmentInfo(network:MediationNetworkType,segmentId:number){
    return useGet<MediationUnitSegmentInfoResponse>("/mediation/site/segment/info",{
        network:network,
        segmentId:segmentId,
    })
}
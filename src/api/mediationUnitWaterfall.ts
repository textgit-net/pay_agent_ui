export enum ParallelType{
    REQUEST_SPEED=1,
    FIXED_CODE_COUNT=2,
    SAME_PRICE=3

}
export  interface MediationUnitWaterfallResponse{
    id:number
    unitId:number
    siteId:number
    segmentId:number
    totalTimeout:number
    waterfallDisplayFreqPeerDay?:number
    waterfallDisplayFreqPeerHour?:number
    waterfallDisplayPacing?:number
    needRewardAgain?:number
    layerTimeout?:number
    parallelType?:ParallelType
    parallelScale?:number
    multilevelTimeOut?:number
    preCache?:boolean
    rewardAgainEcpm?:boolean
}


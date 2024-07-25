import {BasePageRequest, PageWarp } from "~/utils/constant.ts";

/// 任务列表item
export  interface MediationTask{
    id?:number
    createTime?:string
    name?:string
    isEnable?:boolean
    enableLoading?:boolean
    taskItems?: MediationTaskItem[]
}

export interface MediationTaskItemRewardRules{
    pointsRatio?: number
    cashRatio?: number
    maxRewardAmount?: number
    rewardRatio?: number
}

export interface MediationTaskItem {
    id?:number
    taskId?: number
    name?:string
    taskIcon?:string
    taskType?:TaskType
    taskInterval?:number
    isOrderUnlock?:boolean
    rewardNumber?:number
    rewardType?:RewardType
    rewardCount?:number
    rewardRules?: MediationTaskItemRewardRules
    rewardMode?:RewardModeType
    maxRewardNumber?:number
    minRewardNumber?:number
    rewardDepicted?:string
    depicted?:string
    orderSeq?:number
    adUnitId?:number
}   

/**
 * 广告任务查询
 */
export interface  MediationTaskSearch extends BasePageRequest{
    appId?:string
    unitId?:string
}

export interface CreateMediationTaskRequest{
    id?:number
    appId: string
    name?:string
    isEnable?:boolean
    taskItems?: MediationTaskItem[]
}

export enum TaskType{
    ///看广告
    ADV=1,
}

export enum RewardType{
    ///积分
    POINTS=1,
}

export enum RewardModeType{
    ///固定奖励值
    FIXED=1,
    ///随机奖励值
    RANDOM=2,
}

export const getTaskTypeText=(type:TaskType)=>{
    switch (type) {
        case TaskType.ADV:
        return "看广告"
    }
}
export const getRewardTypeText=(type:RewardType)=>{
    switch (type) {
        case RewardType.POINTS:
        return "积分奖励"
    }
}
export const getRewardModeTypeText=(type:RewardModeType)=>{
    switch (type) {
        case RewardModeType.FIXED:
            return "固定奖励值"
        case RewardModeType.RANDOM:
            return "随机奖励值"
    }
}

export async function getAdTaskList(search?:MediationTaskSearch){
    return useGet<PageWarp<MediationTask>>("/ad/task/search",search)
}

export  async function CreateMediationTask(request:CreateMediationTaskRequest){
    return usePost<string>("/ad/task",request)
}

export  async function editMediationTask(request:CreateMediationTaskRequest){
    return usePut<string>("/ad/task",request)
}

export async function postMediationTaskItem(request:MediationTaskItem){
    return usePost<string>("/ad/task/items",request)
}

export async function putMediationTaskItem(request:MediationTaskItem){
    return usePut<string>("/ad/task/items",request)
}

export async function changeMediationTaskEnable(id: string){
    return useGet<string>("/ad/task/change/enable", {id})
}
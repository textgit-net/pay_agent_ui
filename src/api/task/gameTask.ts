import {BasePageRequest, CommonEnable, GamePlatformType, PageWarp} from "~/utils/constant.ts";
import {ApplyInfo, ApplyListSearch} from "~/api/appStore.ts";

export interface GamePlatformResponse{
    id?:GamePlatformType
    name?:string
    appId?:string
    appKey?:string
    commissionRates?:number
    isEnable?:CommonEnable
    createTime?:string
}

export interface GameTaskResponse{
    id?:number
    platformInfo?:GamePlatformResponse
    reward?:number
    userReward?:number
    icon?:string
    name?:string
    remark?:string
    outTaskId?:string
    totalReward?:number
    storeNo:number
    isEnable?:CommonEnable
    createTime?:string
}

export interface GameTaskFormData{
    id?:number
    platform?:GamePlatformType
    reward?:number
    userReward?:number
    icon?:string
    name?:string
    remark?:string
    outTaskId?:string
    totalReward?:number
}
export interface OpenGamePlatform{
    platform?:GamePlatformType
    appId?:string
    appKey?:string
    commissionRates?:number
}
/**
 * 游戏推广任务查询参数
 */
export interface GameTaskSearch extends BasePageRequest{

}

/**
 * 游戏游戏渠道列表
 */
export async function fetchGamePlatform(){
    return useGet<GamePlatformResponse[]>('/game/platform/list')
}

/**
 * 分页查询游戏推广任务列表
 * @param params 查询参数
 */
export async function getGameTaskPage(params:GameTaskSearch){
    return useGet<PageWarp<GameTaskResponse>>('/game/task/list',params)
}

export async function getGameTaskById(id:Number){
    return useGet<GameTaskResponse>(`/game/task/${id}`)
}
export async function saveGameTask(data:GameTaskFormData){
    if(data.id){
        return usePut("/game/task",data)
    }else {
        return usePost("/game/task",data)
    }
}

/**
 * 启用游戏变现渠道
 * @param params
 */
export async function openGamePlatform(params:OpenGamePlatform){
    return usePut("/game/platform/open",params)
}

/**
 * 关闭游戏变现渠道
 * @param id
 */
export async function closeGamePlatform(id:number){
    return usePut(`/game/platform/close/${id}`)
}
export async function changeGameTaskEnable(id:number){
    return usePut(`/game/task/changeEnable/${id}`)
}
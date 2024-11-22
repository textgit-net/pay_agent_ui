import {ResponseBody } from "~/utils/constant.ts";

export interface SubscribeEventItem {
    value?: string
    desc?: string
    isEnable?: boolean
}

export interface SubscribeEventItemWrap {
    groupName?: string
    // 全选判断
    indeterminate?: boolean
    checkAll?: boolean
    checkList?: string[]
    items: SubscribeEventItem[]
}

export interface ChannelEventSubscribeResponse {
    isEnableBot?:boolean
    telegramGroupId?: string
    telegramGroupName?:string
    telegramBootName?:string
    subscribeEvents?: SubscribeEventItemWrap[]
}


export interface ChannelEventSubscribeRequest {
    events?: string[]
}

export interface ChannelSubscribeBootRequest {
    subscribeCode?: string
}

export interface BootGroupCheckResponse {
    groupName?: string
    groupId?: string
}

/**
 * 获取渠道事件订阅详情
 * @param params
 */
export function getChannelSubscribeInfo() :Promise<ResponseBody<ChannelEventSubscribeResponse>> {
    return useGet<ChannelEventSubscribeResponse>('/bot/info')
}

/**
 *启用-禁用机器人
 */
 export function switchChannelEventSubscribe():Promise<ResponseBody<any>> {
    return useGet<string>('/bot/switch')
}

/**
 *获取渠道订阅码
 * @param { string } channelId
 */
 export function getChannelSubscribeCode():Promise<ResponseBody<any>> {
    return useGet<string>('/bot/getBootVerifyCode')
}

/**
 *订阅机器人
 * @param { ChannelSubscribeBootRequest } data
 */
 export function getChannelSubscribeBoot(data: ChannelSubscribeBootRequest):Promise<ResponseBody<any>> {
    return useGet<string>('/bot/bind', data)
}


/**
 *获取渠道群聊订阅状态
 * @param { string } subscribeCode
 */
 export function getChannelSubscribeBootGroupCheck(subscribeCode: string):Promise<ResponseBody<BootGroupCheckResponse>> {
    return useGet<BootGroupCheckResponse>('/bot/bind/check', {'subscribeCode': subscribeCode})
}


/**
 *订阅渠道事件
 * @param data
 */
export function postChannelEventSubscribe(data:string[]):Promise<ResponseBody<any>> {
    return usePost<string>('/bot/subscribe', data)
}

//取消订阅渠道事件
export function postChannelEventUnSubscribe(data:string[]):Promise<ResponseBody<any>> {
    return usePost<string>(`/bot/unSubscribe`, data)
}
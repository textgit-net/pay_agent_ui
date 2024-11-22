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
    isEnableEventSubscribe?:boolean
    telegramGroupId?: string
    telegramBootNo?:string
    telegramBootName?:string
    subscribeEvents?: SubscribeEventItemWrap[]
}


export interface ChannelEventSubscribeRequest {
    channelId?: number,
    events?: string[]
}

export interface ChannelSubscribeBootRequest {
    channelId?: string,
    subscribeCode?: string
}

/**
 * 获取渠道事件订阅详情
 * @param params
 */
export function getChannelSubscribeInfo(channelId: string) :Promise<ResponseBody<ChannelEventSubscribeResponse>> {
    return useGet<ChannelEventSubscribeResponse>('/channel/event/subscribe/info', {'channelId': channelId})
}

/**
 *启用-禁用消息订阅
 * @param { string } channelId
 */
 export function switchChannelEventSubscribe(channelId: string):Promise<ResponseBody<any>> {
    return useGet<string>('/channel/event/subscribe/switch', {'channelId': channelId})
}

/**
 *获取渠道订阅码
 * @param { string } channelId
 */
 export function getChannelSubscribeCode(channelId: string):Promise<ResponseBody<any>> {
    return useGet<string>('/channel/event/getSubscribeCode', {'channelId': channelId})
}

/**
 *订阅机器人
 * @param { ChannelSubscribeBootRequest } data
 */
 export function getChannelSubscribeBoot(data: ChannelSubscribeBootRequest):Promise<ResponseBody<any>> {
    return useGet<string>('/channel/event/subscribe/bot', data)
}


/**
 *获取渠道群聊订阅状态
 * @param { string } subscribeCode
 */
 export function getChannelSubscribeBootGroupCheck(subscribeCode: string):Promise<ResponseBody<any>> {
    return useGet<string>('/channel/event/subscribe/check', {'subscribeCode': subscribeCode})
}


/**
 *订阅渠道事件
 * @param data
 */
export function postChannelEventSubscribe(data:ChannelEventSubscribeRequest):Promise<ResponseBody<any>> {
    return usePost<string>('/channel/event/subscribe', data)
}

//取消订阅渠道事件
export function postChannelEventUnSubscribe(data:ChannelEventSubscribeRequest):Promise<ResponseBody<any>> {
    return usePost<string>(`/channel/event/unSubscribe`, data)
}
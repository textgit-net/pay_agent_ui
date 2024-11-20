import {BasePageRequest, PageWarp,ResponseBody } from "~/utils/constant.ts";


export interface ChannelAddressBlackListSearch extends BasePageRequest{
    channelId?:string
}


export  interface ChannelAddressBlackListResponse {
    id?:string,
    channelId?: number
    country?:string
    province?:string
    city?:string
    createTime?:string
    isEnable?: boolean
}


export interface ChannelAddressBlackListFormData {
    channelId?: number,
    country?: string,
    province?: string,
    city?: string,
    area?: string,
    isEnable?: boolean
}

/**
 * 分页查询渠道区域权限
 * @param params
 */
export function getChannelAddressBlackList(params:ChannelAddressBlackListSearch) :Promise<ResponseBody<PageWarp<ChannelAddressBlackListResponse>>> {
    return useGet<PageWarp<ChannelAddressBlackListResponse>>('/channel/address/auth', params)
}


/**
 * 添加区域权限
 * @param data
 */
export function saveChannelAddressBlackList(data:ChannelAddressBlackListFormData) {
    return usePost<string>('/channel/address/auth', data)
}

//删除渠道区域权限
export function delChannelAddressBlackList(id:string){
    return useDelete<string>(`/channel/address/auth/${id}`)
}
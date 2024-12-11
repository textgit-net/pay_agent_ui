import {BasePageRequest, PageWarp,ResponseBody,PayChannelType } from "~/utils/constant.ts";


export interface ProductItem {
    productCode?: string
    productName?: string
    channelType?: PayChannelType
    freeRate?: number
    agentId?: number
    channelCount?: number
    isEnable?: boolean
}

/**
 * 渠道分组查询
 */
export interface ChannelGroupSearch extends BasePageRequest{
    keyword?:string
}


export  interface ChannelGroupSimpleResponse {
    id?:number,
    groupCode?:string
    name?:string
    isEnable?:boolean
    channelType?: PayChannelType,
    // 用作逻辑处理
    rate?: number
}

export interface ChannelGroupListResponse extends ChannelGroupSimpleResponse{
    description?:string
    channelCount?:number
    createTime?:string
}


/**
 * 分页查询渠道分组列表
 * @param params
 */
export function searchChannelGroup(params:ChannelGroupSearch) :Promise<ResponseBody<PageWarp<ChannelGroupListResponse>>> {
    return useGet<PageWarp<ChannelGroupListResponse>>('/channel/group/page', params)
}

/**
 * 查询渠道组详情
 */
export function getChannelGroupInfo(code:string) :Promise<ResponseBody<ChannelGroupListResponse>> {
    return useGet<ChannelGroupListResponse>('/channel/group/info', { code })
}

/**
 * 加载所有渠道分组列表
 */
export function getChannelGroups(keyword?: string):Promise<ResponseBody<ChannelGroupSimpleResponse[]>> {
    return useGet<ChannelGroupSimpleResponse[]>('/channel/group/query', {keyword: keyword})
}

export interface ChannelGroupFormData extends ChannelGroupSimpleResponse{
    description?:string,
    isEdit?: boolean
}

/**
 * 保存渠道分组
 * @param data
 */
export function saveChannelGroup(data:ChannelGroupFormData) {
    if(data.id){
        return usePut<string>('/channel/group', data)
    }else {
        return usePost<string>('/channel/group', data)
    }
}

export function changeChannelGroupEnable(groupCode:string){
    return useGet<string>(`/channel/group/changeEnable/${groupCode}`)
}




import {
    BasePageRequest,
    PageWarp,
    ResponseBody
} from "~/utils/constant.ts";

export interface seedListSearch extends BasePageRequest{
    title?:string
}

export enum ContentTypeEnum {
    textarea = '1',
    video = '2',
    H5 = '3'
}

export const getContentTypeEnumText=(status:ContentTypeEnum)=>{
    switch (status) {
        case ContentTypeEnum.textarea:
        return "富文本"
        case ContentTypeEnum.video:
        return "视频链接"
        case ContentTypeEnum.H5:
        return "H5链接"
    }
}

export enum PostTypeEnum {
    xrbk = 1, // 新人必看
    zczq = 2 // 种草赚钱
}

export const getPostTypeEnumText=(status:PostTypeEnum)=>{
    switch (status) {
        case PostTypeEnum.xrbk:
            return "新人必看"
        case PostTypeEnum.zczq:
            return "种草赚钱"
    }
}

export enum ZhongCaoStatusEnum {
    open = 0,
    close = 1
}

export const getZhongCaoStatusEnumText=(status:ZhongCaoStatusEnum)=>{
    switch (status) {
        case ZhongCaoStatusEnum.open:
            return "开启"
        case ZhongCaoStatusEnum.close:
            return "关闭"
    }
}

export interface seedInfo {
    id?:number
    title?:string
    picture?:string
    content?:string
    videoUrl?:string
    h5Url?:string
    contentType?:ContentTypeEnum
    postType?:PostTypeEnum
    status?:ZhongCaoStatusEnum
}

export interface seedListItem extends seedInfo {
    createTime?:string
    updateTime?:string
    pageviews?:number
}



// 文章列表
// /seedingPostOverall/list
export async function getSeedList(params:seedListSearch){
    return useGet<PageWarp<seedListItem>>('/seedingPostOverall/list',params)
}

// 文章详情
// /seedingPostOverall/{id}
export async function getSeedInfo(id:number){
    return useGet<seedListItem>(`/seedingPostOverall/${id}`)
}


export async function deleteSeedArticle(id:number){
    return useDelete<ResponseBody<any>>(`/seedingPostOverall/delete/${id}`)
}

export async function addSeedArticle(params: seedInfo){
    return usePost<ResponseBody<any>>("/seedingPostOverall/save",params)
}

export async function updateSeedArticle(params: seedInfo){
    return usePost<ResponseBody<any>>("/seedingPostOverall/update",params)
}


export async function saveSeedArticle(data: seedInfo){
    if(data.id){
        return usePost<ResponseBody<any>>("/seedingPostOverall/update",data)
    }
    return usePost<ResponseBody<any>>("/seedingPostOverall/save",data)
}

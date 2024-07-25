import { useDelete, usePost } from '~/utils/request';
import { CascaderProps } from 'ant-design-vue';
import {
    BasePageRequest,
    PageWarp,
    ResponseBody,
} from "~/utils/constant.ts";

export enum ApplicationPopularTypeEnum {
    todayRecommend = 1,
    newHot = 2
}

export function getApplicationPopularTypeText(type: ApplicationPopularTypeEnum):string {
    switch (type) {
        case ApplicationPopularTypeEnum.todayRecommend:
            return '热门推荐';
        case ApplicationPopularTypeEnum.newHot:
            return '最新热门';
    }
}


// 创建\更新应用 请求数据 类型 
export interface ApplyFrom{
    id?: string,
    status?: number,
    applyName?: string,
    applyLogo?: string,
    applySizi?: string,
    applyRemark?: string,
    applyDownloadLink?: string,
    packetName?: string,
    clientPlatform?: string,
    applySing?: string, 
    categoryId?: string[],
    createTime?: string,
    createBy?: string,
    updateTime?: string,
    updateBy?: string,
    sort?:number,

}

//应用详情 （返回值类型）
export interface getApplyFrom{
    id?:string,
    status?:number,
    applyName?:	string,	
    applyLogo?:	string,	
    applySizi?:	number,	
    applyRemark?:string,	
    applyDownloadLink?:	string,	
    packetName?:string,	
    clientPlatform?:string,	
    applySing?:	string,	
    categoryId?:number,
    createTime?:string,
    createBy?:string,	
    updateTime?:string,
    updateBy?:string,
}

// 查询应用列表 ---请求类型 
//  分页
  export interface ApplyListSearch extends BasePageRequest{
    name?:string,
    packetName?:string,
    categoryId?:number,
    status?:number
}

export enum ApplyInfoStatus {
    onLine = 0,
    offLine = 1
}

// 查询应用 返回值类型
export interface ApplyInfo {
    id?: string,
    applyName?: string,
    packetName?:string,
    categoryId?:number,
    categoryName?: string,
    applyLogo?:string,
    appFileName?: string,
    applySizi?:string,
    applyRemark?:string,
    applyDownloadLink?:string,
    applySing?:string,
    createTime?:string,
    createBy?:string,
    updateTime?:string,
    updateBy?:string
    clientPlatform?:string,
    sort?:number,
    status?: ApplyInfoStatus,
    isEnable?: boolean

}

// 业务类型
export enum appStatus {
    // 1.正常
    ONLINE = 0,
    // 3.停用
    CLOSE =1 ,
}

export const getappStatus=(type:ApplyInfoStatus)=>{
    switch (type){
        case ApplyInfoStatus.onLine:
            return "正常"
        case ApplyInfoStatus.offLine:
            return "停用"
    }
}


// 分类 

export interface getcategory  extends BasePageRequest{categoryName?: string}
    

export interface categoryList  {
    id?: number,
    categoryName?:string,
    status?: number,
    sortNo?: number,
    createTime?: string,
    createBy?: string,
    updateTime?: string,
    updateBy?: string
}

export interface PopularRecommendationRequest {    
    id?: string;
    applyId: string;
    applyName: string;
    popularType: ApplicationPopularTypeEnum;
    status: boolean;
    sort?: number;
}

export interface getHotList extends BasePageRequest{applyName?: string}

export interface HotList  {
    applyName?: string,
    applyId?:number,
    createTime?:number,
    id?:number,
    sort?:number,
    status?:boolean,
    updateTime?:number,
    popularType?:ApplicationPopularTypeEnum,
    
}


// 获取应用列表 --根据字段搜索应用  
export async function getcoApplyList(search:ApplyListSearch){
    return useGet<PageWarp<ApplyInfo>>('/coApply/list',search)
}

// 分类接口

export async function getcoApplyCategoryList(){
    return useGet<CascaderProps['options']>('/coApply/category/list')
}

export async function savecoApply(data:ApplyFrom){
    if(data.id){
        return usePut<string>(`/coApply/update/${data.id}`,data,{loading:true})
    }
    return usePost<string>("/coApply/save",data,{loading:true})
}

export async function getApplyInfo(id:number){
    return useGet<ApplyInfo>(`/coApply/${id}`)
}


export async function removecoApply(id:number){
    return useDelete<number>(`/coApply/delete/${id}`)
}

// 获取分类列表 -done
export async function getCategoryList(params:getcategory){
    return useGet<PageWarp<categoryList>>('/softwareCategory/list',params)
}

// 分类详情

export async function getCategoryInfo(id:number){
    return useGet<any>(`/softwareCategory/${id}`)
}

// 删除
export async function delCategory(id:number){
    return useDelete<string>(`/softwareCategory/delete/${id}`)
}


// 新增分类

export async function saveCategory(data:categoryList){
    if(data.id){
        return usePost<ResponseBody<any>>('/softwareCategory/update',data)
    }
    return usePost<ResponseBody<any>>("/softwareCategory/save",data)
}

// 查询热门推荐列表
export async function getHotAppList(params){
    return useGet('/popularRecommendation/list',params)
}


//编辑热门推荐
export async function editHotApp(data){
    return usePost(`/popularRecommendation/update`,data)
    
    
}

// 添加热门推荐
export async function addHotApp(data: PopularRecommendationRequest){
    return usePost("/popularRecommendation/save", data)
}

// 热门推荐应用详情
export async function getHotAppInfo(id:number){
    return useGet(`/popularRecommendation/${id}`)
}


// 删除热门推荐app
export async function delHotApp(id:number){
    return useDelete(`/popularRecommendation/delete/${id}`)
}

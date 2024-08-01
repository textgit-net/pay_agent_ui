export interface SelectOption<T>{
  value:T,
  title:string
}

export const uploadAction=import.meta.env.VITE_APP_BASE_API+"/oss/upload"



export  enum  SerialStatus{
  ONGOING=0,
  COMPLETE=1
}

export enum CommonEnable{
  UNKNOWN=0,
  OPEN=1,
  DISABLE=2
}

/**
 * 签名类型
 */
export enum SignType{
  MD5,
  RSA2
}
/**
 * 获取签名类型描述文本
 * @param type
 */
export const getSignTypeText=(type:SignType)=>{
  switch (type) {
    case SignType.MD5:
      return "MD5"
    case SignType.RSA2:
      return "RSA2"
  }
}
/**
 * 签名类型下拉选项
 */
export const  SignTypeSelectOption:SelectOption<SignType>[]=[
  {
    value:SignType.MD5,
    title:getSignTypeText(SignType.MD5)
  },
  {
    value:SignType.RSA2,
    title:getSignTypeText(SignType.RSA2)
  }
]
export enum PayChannelType{
  ALI="alipay"
}
/**
 * 获取支付渠道描述文本
 * @param type
 */
export const getPayChannelTypeText=(type:PayChannelType)=>{
  switch (type) {
    case PayChannelType.ALI:
      return "支付宝"
  }
}
/**
 * 支付渠道下拉选项
 */
export const  PayChannelTypeSelectOption:SelectOption<PayChannelType>[]=[
  {
    value:PayChannelType.ALI,
    title:getPayChannelTypeText(PayChannelType.ALI)
  }
]








export interface UploadResourceResponse{
  id?:number
  name?:string
  fileType?:string
  contentType?:string
  fileSize?:number
  fileUrl?:string
  referenceCount?:number
  createTime?:string
}

export interface ResponseBody<T = any> {
  code: number
  data?: T
  success?: boolean,
  msg: string
}
export interface PageWarp<T = any> {
  total: number
  rows: T[]
}

/**
 * 通用分页请求参数结构
 */
export interface BasePageRequest{
  page:number
  limit:number
}

/**
 * 通用下拉框选项数据结构
 */
export interface BaseSelectOption<T>{
  value:T,
  name:string
}
export enum AccessEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}



/**
 * 基础树形结构
 */
export interface BaseTree<T,E>{
  children?:BaseTree<T, E>[]
  deep?:number
  name?:string
  id?:E
  weight?:number
  parentId?:number
}
export enum DynamicLoadEnum {
  FRONTEND = 'FRONTEND', // 前端动态加载菜单，使用这种方式将从dynamic-routes.ts中加载菜单和路由信息
  BACKEND = 'BACKEND', // 后端动态加载菜单， 使用这种方式将从后端接口加载菜单和路由信息
}

export enum STATUS {
  OFF = '0',
  RUNNING = '1',
  ONLINE = '2',
  ERROR = '3',

}
// 默认情况下我们提供从后端加载的逻辑
export const DYNAMIC_LOAD_WAY = import.meta.env.VITE_APP_LOAD_ROUTE_WAY ?? DynamicLoadEnum.BACKEND

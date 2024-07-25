export interface SelectOption<T>{
  value:T,
  title:string
}

export const uploadAction=import.meta.env.VITE_APP_BASE_API+"/oss/upload"



export  enum  SerialStatus{
  ONGOING=0,
  COMPLETE=1
}


export enum MediationNetworkType{
    CSJ=1,
    GDT=2,
    KS=3,
    AD_MOB=4,
    APPLOVIN=5,
    AD_SCOPE=6,
    BAIDU_MOB=7,
    K_LEVIN=8,
    SIG_MOB=9,
    UNITY=10
}

/**
 * android应用商店类型
 */
export enum AndroidApplicationStoreType{
  LENOVO=1
}
export enum CommonEnable{
  UNKNOWN=0,
  OPEN=1,
  DISABLE=2
}
/**
 * 获取android应用商店类型描述文本
 * @param type
 */
export const getAndroidApplicationStoreTypeText=(type:AndroidApplicationStoreType)=>{
  switch (type) {
    case AndroidApplicationStoreType.LENOVO:
      return "联想(乐商店)"
  }
}
/**
 * android应用商店类型下拉选项
 */
export const  AndroidApplicationStoreTypeSelectOption:SelectOption<AndroidApplicationStoreType>[]=[
  {
    value:AndroidApplicationStoreType.LENOVO,
    title:getAndroidApplicationStoreTypeText(AndroidApplicationStoreType.LENOVO)
  }
]

/**
 * 应用商店状态
 */
export enum ApplicationStoreStatus{
  WAIT_SUBMIT=1,
  AUDIT=2,
  REJECTED=3,
  COMPLETE=4
}

/**
 * 应用商店状态描述文本
 * @param status
 */
export const getApplicationStoreStatusText=(status:ApplicationStoreStatus)=>{
  switch (status) {
    case ApplicationStoreStatus.WAIT_SUBMIT:
      return "待提审"
    case ApplicationStoreStatus.AUDIT:
      return "审核中";
    case ApplicationStoreStatus.REJECTED:
      return "驳回"
    case ApplicationStoreStatus.COMPLETE:
      return  "完成"
  }
}

/**
 * 应用商店状态下拉选项
 */
export const  ApplicationStoreStatusSelectOption:SelectOption<ApplicationStoreStatus>[]=[
  {
    value:ApplicationStoreStatus.WAIT_SUBMIT,
    title:getApplicationStoreStatusText(ApplicationStoreStatus.WAIT_SUBMIT)
  },
  {
    value:ApplicationStoreStatus.AUDIT,
    title:getApplicationStoreStatusText(ApplicationStoreStatus.AUDIT)
  },
  {
    value:ApplicationStoreStatus.REJECTED,
    title:getApplicationStoreStatusText(ApplicationStoreStatus.REJECTED)
  },
  {
    value:ApplicationStoreStatus.COMPLETE,
    title:getApplicationStoreStatusText(ApplicationStoreStatus.COMPLETE)
  }
]

export enum MediationSiteCodeType{
  REWARD=1,
  SPLASH=2,
  INTERSTITIAL_FULL=3,
  BANNER=4
}
export const getMediationSiteCodeTypeText=(type:MediationSiteCodeType)=>{
  switch (type) {
    case MediationSiteCodeType.REWARD:
      return "激励视频"
    case MediationSiteCodeType.SPLASH:
      return "开屏广告"
    case MediationSiteCodeType.INTERSTITIAL_FULL:
      return "插全屏广告"
    case MediationSiteCodeType.BANNER:
      return "Banner"
  }
}
export const  MediationSiteCodeTypeSelectOption:SelectOption<MediationSiteCodeType>[]=[
  {
    value:MediationSiteCodeType.REWARD,
    title:getMediationSiteCodeTypeText(MediationSiteCodeType.REWARD)
  },
  {
    value:MediationSiteCodeType.SPLASH,
    title:getMediationSiteCodeTypeText(MediationSiteCodeType.SPLASH)
  },
  {
    value:MediationSiteCodeType.INTERSTITIAL_FULL,
    title:getMediationSiteCodeTypeText(MediationSiteCodeType.INTERSTITIAL_FULL)
  },
  {
    value:MediationSiteCodeType.BANNER,
    title:getMediationSiteCodeTypeText(MediationSiteCodeType.BANNER)
  }
]

export enum MediationSiteStatus{
  DISABLE=0,
  ENABLE=1
}
export const getMediationSiteStatusText=(status:MediationSiteStatus)=>{
  switch (status) {
    case MediationSiteStatus.DISABLE:
      return "禁用"
    case MediationSiteStatus.ENABLE:
      return "启用"
  }
}
export const  MediationSiteStatusSelectOption:SelectOption<MediationSiteStatus>[]=[
  {
    value:MediationSiteStatus.DISABLE,
    title:getMediationSiteStatusText(MediationSiteStatus.DISABLE)
  },
  {
    value:MediationSiteStatus.ENABLE,
    title:getMediationSiteStatusText(MediationSiteStatus.ENABLE)
  }
]

export enum CompanyAccountType{
  CSJ=1,
  ALI_YUN=2,
  SINA_CLOUD=3,
  LENOVO=4
}

export const getCompanyAccountTypeText=(type:CompanyAccountType)=>{
  switch (type) {
    case CompanyAccountType.ALI_YUN:
      return "啊里云"
    case CompanyAccountType.CSJ:
      return "穿山甲";
    case CompanyAccountType.SINA_CLOUD:
      return "新浪云"
    case CompanyAccountType.LENOVO:
      return  "联想开发者"
  }
}

export const  companyAccountSelectOption:SelectOption<CompanyAccountType>[]=[
  {
    value:CompanyAccountType.CSJ,
    title:getCompanyAccountTypeText(CompanyAccountType.CSJ)
  },
  {
    value:CompanyAccountType.ALI_YUN,
    title:getCompanyAccountTypeText(CompanyAccountType.ALI_YUN)
  },
  {
    value:CompanyAccountType.SINA_CLOUD,
    title:getCompanyAccountTypeText(CompanyAccountType.SINA_CLOUD)
  },
  {
    value:CompanyAccountType.SINA_CLOUD,
    title:getCompanyAccountTypeText(CompanyAccountType.LENOVO)
  }
]

export enum GamePlatformType{
  TAO_JIN_91=1
}

export const getGamePlatformTypeTypeText=(type:GamePlatformType)=>{
  switch (type) {
    case GamePlatformType.TAO_JIN_91:
      return "91淘金"
  }
}
export const  gamePlatformTypeSelectOption:SelectOption<GamePlatformType>[]=[
  {
    value:GamePlatformType.TAO_JIN_91,
    title:getGamePlatformTypeTypeText(GamePlatformType.TAO_JIN_91)
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
 * 终端平台
 */
export enum ClientPlatform{
  ANDROID="ANDROID",
  IOS="IOS"
}

/**
 * 应用状态
 */
export enum ApplicationStatus{
  //关闭
  CLOSE=1,
  //测式
  TEST=2,
  //上线
  ONLINE=3
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

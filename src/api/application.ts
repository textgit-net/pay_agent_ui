import {
    AndroidApplicationStoreType,
    ApplicationStoreStatus,
    BasePageRequest,
    PageWarp,
    SerialStatus
} from "~/utils/constant.ts";
import {CompanyInfo} from "~/api/company.ts";
import {CascaderProps} from "ant-design-vue";

/**
 * 支付宝配制参数
 */
export interface AlipayConfigParams{
    //支付宝应用ID
    appId?:string
    //应用私钥
    privateKey?:string
    //支付宝合作ID
    pid?:string
    //应用公钥证书
    appCert?:string
    //支付宝公钥证书
    alipayCert?:string
    //支付宝根证书
    alipayRootCert?:string

}
//查询接口---获取应用列表
export interface ApplicationSearch extends BasePageRequest{
    companyId?:number
    keyword?:string
    status?:number
    platform?:number
    companyName?:string
}
// 种类 
export  interface ApplicationCategory{
    id:number
    parentId:number
    name:string
    pathIds:string
    pathName:string
}
//复制应用  传参 类型接口
export interface CopyApplicationRequest{
    originalAppId?:number
    name?:string
    companyId?:number
    bundleIdentifier?:string
}
// 应用下载链接 枚举
export  enum ApplicationLinkType{
    DYNAMIC_PAGE="DYNAMIC_PAGE",
    H5="H5",
    Native="Native"
}
export  interface NavigationItem{
    icon:string
    selectIcon:string
    text?:string
    linkType?:ApplicationLinkType,
    target?:string
}

export  interface ApplicationNavigation{
    textColor:string
    selectTextColor:string
    textSize:number
    selectTextSize:number
    isSelectBold:boolean
    items?:NavigationItem[]
}
export  interface  Application{
    id:number
    company:CompanyInfo
    name:string
    icon:string
    appSerial?:string
    appSerialImg?:string
    category?:ApplicationCategory
    appSerialStatus?:SerialStatus
    androidStoreStatus?:ApplicationStoreStatus
    androidStoreUrl?:string
    androidStoreType?:AndroidApplicationStoreType
    androidVersion?:string
    createTime:string
    updateTime:string
    applicationStatus:number
    regText?: string
}
export  interface  ApplicationInfo extends Application{

    androidIcons:any[]
    iosIcons:any[]
    softwareCopyright:string
    domain:string
    applicationVersion:string
    applicationDescribe:string
    applicationNote:string
    applicationScreenShots:string
    androidSha1:string
    androidMd5:string
    bundleIdentifier:string
    navigationConfig?:ApplicationNavigation

}

export enum AndroidResourceSize{
    MDPI="MDPI",
    HDPI="HDPI",
    X_HDPI="X_HDPI",
    XX_HDPI="XX_HDPI",
    XXX_HDPI="XXX_HDPI"
}
export enum IosResourceSize{
    X1=1,
    X2=2,
    X3=3
}
export enum  IosIconSize{
    ICON_SIZE_40="ICON_SIZE_40",
    ICON_SIZE_60="ICON_SIZE_60",
    ICON_SIZE_58="ICON_SIZE_58",
    ICON_SIZE_87="ICON_SIZE_87",
    ICON_SIZE_80="ICON_SIZE_80",
    ICON_SIZE_120="ICON_SIZE_120",
    ICON_SIZE_180="ICON_SIZE_180",
    ICON_SIZE_1024="ICON_SIZE_1024"
}



export interface IosIconWarp{
    ICON_40:string
    ICON_60:string
    ICON_58:string
    ICON_87:string
    ICON_80:string
    ICON_120:string
    ICON_180:string
    ICON_1024:string
}

export interface AndroidIconWarp{
    MDPI:string,
    HDPI:string,
    X_HDPI:string,
    XX_HDPI:string,
    XXX_HDPI:string
}
export  interface AndroidSplashImageWarp{
    MDPI:string,
    HDPI:string,
    X_HDPI:string,
    XX_HDPI:string,
    XXX_HDPI:string
}
export interface ApplicationFrom{
    id?:number
    companyId?:number
    name?:string
    icon?:string
    categoryIds?:string[]
    appSerial?:string
    appSerialImg?:string
    appSerialStatus?:SerialStatus
    androidIcons:AndroidIconWarp
    androidSplashImages:AndroidSplashImageWarp
    androidStoreStatus?:ApplicationStoreStatus
    androidStoreUrl?:string
    androidStoreType?:AndroidApplicationStoreType
    androidVersion?:string
    iosIcons:IosIconWarp
    softwareCopyright?:string
    domain?:string
    applicationVersion?:string
    applicationDescribe?:string
    applicationNote?:string
    applicationScreenShots?:string
    applicationCategoryId?:number
    applicationStatus?:number
    bundleIdentifier:string
    navigationConfig?:ApplicationNavigation
}

export interface AddToAppStoreRequest {
    id?: number;
    categoryId?: string;
    remark?: string;
}

//获取应用详情
export async function getApplicationInfo(id:number){
    return useGet<any>(`/application/${id}`)
}

export async function searchApplication(search:ApplicationSearch){
    return useGet<PageWarp<ApplicationInfo>>("/application",search)
}

export async function saveApplication(data:ApplicationFrom){
    if(data.id){
        return usePut<string>("/application",data,{loading:true})
    }
    return usePost<string>("/application",data,{loading:true})
}

export async function removeApplication(id:number){
    return useDelete(`/application/${id}`)
}

export async function bathRemoveApplication(ids:string){
    return useDelete(`/application/${ids}`)
}


export  async function getUsableApps(){
    return useGet(`/application/usable/list`)
}

export async function getApplicationCategory(){
    return useGet<CascaderProps['options']>("/application/category")
}

/**
 * 复制应用
 * @param data
 */
export async function copyApp(data:CopyApplicationRequest){
    return usePost<String>("/application/copy",data)
}

// 上架应用商店
export async function addToAppStore(data: AddToAppStoreRequest){
    return usePost<String>(`/application/listing`, data)
}

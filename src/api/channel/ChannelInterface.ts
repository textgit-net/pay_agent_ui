import {BasePageRequest, ResponseBody, PageWarp, PayChannelType, SignType, PayModeType} from "~/utils/constant.ts";
import {exists} from "fs-extra";
import {AccountInfoResponse} from "~/api/account/AccountInterface.ts";


export interface ChannelSimpleResponse{
    /**
     * 渠道ID
     */
    id?: number
    /**
     * 渠道名称
     */
    name?: string
    /**
     * 渠道类型
     */
    channelType?: PayChannelType
}

export interface ChannelInfo extends ChannelListResponse {
    
}

/**
 * 渠道列表结构体
 */
export interface ChannelListResponse extends ChannelSimpleResponse{

    /**
     * 签名类型
     */
    signType?:SignType
    /**
     * 是否启用
     */
    isEnable?:boolean
    /**
     * 是否启用分账
     */
    isEnableRoyalty?:boolean
    /**
     * 订单支付成功金额
     */
    successAmount?:number
    /**
     * 订单支付累计金额
     */
    // 渠道支付方式
    payModes?: PayModeType[]

    successCount?: number
    totalCount?: number
    totalAmount?:number
    createTime?:string
}


/**
 * 支付宝渠道配制
 */
export interface AlipayChannelConfig  {
    /**
     * 支付宝应用ID
     */
    appId?:string
    /**
     * 支付宝合作伙伴Id
     */
    pid?:string
    /**
     * 开发者私钥，由开发者自己生成
     */
    privateKey?:string
    /**
     * 支付宝公钥
     */
    alipayPublicKey?:string
    /**
     * 是否使用证书方式
     */
    isCert:boolean
    /**
     * 支付宝公钥
     */
    alipayPublicCert?:string
    /**
     * 应用公钥
     */
    appCert?:string
    /**
     * 支付宝根证书
     */
    alipayRootCert?:string

}

/**
 * 渠道表单
 */
export interface ChannelFormData{
    /**
     * 渠道ID
     */
    id?: number
    /**
     * 渠道名称
     */
    name?: string

    groupCode?:string
    /**
     * 渠道类型
     */
    channelType?: PayChannelType
    /**
     * 渠道配制
     */
    channelConfig?: any

    /**
     * 分账配制
     */
    allocationConfig?:any
    /**
     * 是否启用分账
     */
    isEnableRoyalty?:boolean
    payModes?: any,
    //商户id
    mchId?: number;
}



/**
 * 渠道查询参数
 */
export interface ChannelSearch extends BasePageRequest{
    /**
     * ID/名称
     */
    keyword?:string
    /**
     * 渠道类型,多个渠道类型用逗号分隔
     */
    channelTypes?: string
    /**
     * 是否忽略禁用的渠道
     */
    isIgnoreDisable:boolean
}

export interface ALLChannelListRequest {
    /**
     * ID/名称
     */
    keyword?:string
    /**
     * 渠道类型,多个渠道类型用逗号分隔
     */
    channelTypes?: string
    /**
     * 是否忽略禁用的渠道
     */
    isIgnoreDisable:boolean
}

export interface ChannelTestRequest{
    channelId?:number
    amount?:number
    body?:string
    subject?:string
    isWebCashier?:boolean
    payMode?:PayModeType
}
export enum PayDataType{
    app="app",
    codeUrl="codeUrl",
    codeImgUrl="codeImgUrl",
    redirect="redirect"
}
export interface ChannelTestResponse {
    orderNo:string
    data:string
    dataType:PayDataType
}
/**
 * 分页查询渠道列表
 * @param params
 */
export function searchChannel(params:ChannelSearch) {
    return useGet<PageWarp<ChannelListResponse>>('/channel/page', params)
}

/**
 * 通过渠道类型获取商户渠道列表
 * @param type 渠道类型
 */
export function getChannelListWithType(type:PayChannelType){
    return useGet<ChannelSimpleResponse[]>("/channel/list",{channelTypes:type})
}


/**
 * 查询ALL渠道列表
 * @param {ALLChannelListRequest} params
 */
export function getALLChannelList(params: ALLChannelListRequest): Promise<ResponseBody<ChannelListResponse[]>>{
    return useGet<ChannelListResponse[]>("/channel/list",params)
}

/**
 * 保存渠道
 * @param data
 */
export function saveChannel(data:ChannelFormData) {
    if(data.id){
        return usePut<String>('/channel', data,)
    }
    return usePost<String>("/channel", data,)
}

/**
 * 关闭渠道
 * @param id
 */
export function changeChannel(id:number) {
    return usePut<String>(`/channel/change/${id}`)
}


export function getChannelEditInfo(id:any){
    return useGet<ChannelFormData>(`/channel/edit/${id}`)
}
export function channelTest(params:ChannelTestRequest){
    return usePost<ChannelTestResponse>("/channel/payTest",params)
}


/**
 * 获取渠道详情
 * @param id
 */
export function getChannelInfo(id:string):Promise<ResponseBody<ChannelInfo>> {
    return useGet<ChannelInfo>(`/channel/info/${id}`)
}


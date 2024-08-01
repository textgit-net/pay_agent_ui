import {BasePageRequest, PageWarp, PayChannelType} from "~/utils/constant.ts";
import {ChannelSimpleResponse} from "~/api/channel/ChannelInterface.ts";

/**
 * 订单列表结构体
 */
export interface OrderListResponse{
    /**
     * 订单ID
     */
    id:string
    /**
     * 商户订单号
     */
    mchOrderNo:string
    /**
     * 渠道信息
     */
    channelInfo:ChannelSimpleResponse

    /**
     * 支付方式
     */
    payMode:string
    /**
     * 支付金额
     */
    amount:number
    /**
     * 商户手续费费率
     */
    mchFeeRate:number|undefined
    /**
     * 商户手续费
     */
    mchFeeAmount:number|undefined
    /**
     * 币种
     */
    currency:string
    /**
     * 订单状态
     */
    orderStatus:number
    /**
     * 顶单回调状态
     */
    notifyStatus:number|undefined
    /**
     * 商品标题
     */
    subject:string
    /**
     * 商品描述信息
     */
    body:string
    /**
     * 渠道订单号
     */
    channelOrderNo:string|undefined
    /**
     * 订单分账模式
     */
    divisionMode:number|undefined
    /**
     * 订单分账状态
     */
    divisionStatus:number|undefined
    /**
     * 最新分账时间
     */
    divisionLastTime:string|undefined
    /**
     * 渠道支付错误码
     */
    errCode:string|undefined
    /**
     * 渠道支付错误描述
     */
    errMsg:string|undefined
    /**
     * 买家备注
     */
    buyerRemark:string|undefined
    /**
     * 卖家备注
     */
    sellerRemark:string|undefined
    /**
     * 订单支付成功时间
     */
    successTime:string|undefined
    /**
     * 创建时间
     */
    createdTime:string
}

/**
 * 订单查询参数
 */
export interface OrderSearch extends BasePageRequest{
    /**
     * 订单ID
     */
    orderNo?:string
    /**
     * 商户订单号
     */
    mchOrderNo?:string
    /**
     * 渠道类型,多个渠道类型用逗号分隔
     */
    channelTypes:PayChannelType[]
    /**
     * 订单状态
     */
    orderStatus:number
}

/**
 * 分页查询订单列表
 * @param params {@link OrderSearch}
 */
export function searchOrder(params:OrderSearch) {
    return useGet<PageWarp<OrderListResponse>>('/order/page', params)
}



import {BasePageRequest, PageWarp, PayChannelType} from "~/utils/constant.ts";
import {ChannelSimpleResponse} from "~/api/channel/ChannelInterface.ts";

/**
 * 列表结构体
 */
export interface DataListResponse{
    /**
     * 商户id
     */
    mchId:number
    /**
     * 商户名称
     */
    mchName:string
    /**
     * 支付方式
     */
    payMode:string
    /**
     * 总金额
     */
    totalAmount:number
    /**
     * 成功金额
     */
    successAmount:number
    /**
     * 成功订单
     */
    successCount:number
    /**
     * 总订单
     */
    totalCount:number
    /**
     * 日期
     */
    cusDate:string
}

/**
 * 查询参数
 */
export interface DataSearch extends BasePageRequest{
    /**
     * 日期
     */
    cusDate?:string
    /**
     * 商户
     */
    mchId?:number
    /**
     * 支付方式
     */
    payMode:string
}

/**
 * 分页查询订单列表
 * @param params {@link OrderSearch}
 */
export function searchOrder(params:DataSearch) {
    return useGet<PageWarp<DataListResponse>>('/statistics/findMchOrderAggAmountList', params)
}



import {BasePageRequest, PageWarp} from "~/utils/constant.ts";

/**
 * 订单列表结构体
 */
export interface OrderListResponse{

}

/**
 * 订单查询参数
 */
export interface OrderSearch extends BasePageRequest{

}

/**
 * 分页查询订单列表
 * @param params {@link OrderSearch}
 */
export function searchOrder(params:OrderSearch) {
    return useGet<PageWarp<OrderListResponse>>('/order/page', params)
}



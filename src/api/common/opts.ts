import {ResponseBody, PayChannelType} from "~/utils/constant.ts";

export interface PayModesItem {
    payMode?: string
    payModeName?: string
}

export interface ChannelTypeAndPayModeOptItem {
    channelType?: PayChannelType,
    channelTypeName?: string,
    payModes?: PayModesItem[]
}


/**
 * 获取所有渠道类型及其对应的支付方式
 */
export function getChannelTypeAndPayModeOpts():Promise<ResponseBody<ChannelTypeAndPayModeOptItem[]>>{
    return useGet<ChannelTypeAndPayModeOptItem[]>("/channel/channelTypeAndPayMode")
}
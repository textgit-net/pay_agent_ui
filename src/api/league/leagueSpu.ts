import {getMediationSiteCodeTypeText, MediationSiteCodeType, SelectOption} from "~/utils/constant.ts";
import {MediationUnitInfoResponse} from "~/api/mediationSiteUnit.ts";

export enum LeagueSpuChannel{
    DAI_FA_TU=1
}
export const getLeagueSpuChannelText=(type:LeagueSpuChannel)=>{
    switch (type) {
        case LeagueSpuChannel.DAI_FA_TU:
            return "待发兔"
    }
}
export const  LeagueSpuChannelSelectOption:SelectOption<LeagueSpuChannel>[]=[
    {
        value:LeagueSpuChannel.DAI_FA_TU,
        title:getLeagueSpuChannelText(LeagueSpuChannel.DAI_FA_TU)
    }
]
export enum SaleStatus{
    ON_SHELF=1,
    OFF_SHELF=2
}
export interface LeagueSpuPriceRangeSearch{
    min?:number
    max?:number
}
export  interface LeagueSpuSearch{
    keyword?:string
    channel?:LeagueSpuChannel
    saleStatus?:SaleStatus
    priceRangeType?:number
    priceRange?:LeagueSpuPriceRangeSearch
}

export interface EditeLeagueSpuChannelRequest{
    id?:number
    name?:string
    channelType?:LeagueSpuChannel
    channelConfig?:any
    isEnable?:boolean
}

export async function getLeagueSpuChannels(){
    return useGet<any>("/league/product/channel")
}
/**
 * 保存供应连渠道
 * @param request
 */
export async function saveLeagueSpuChannel(request:EditeLeagueSpuChannelRequest){
   if(request.id){
       return usePut("/league/product/channel",request)
   }
   return usePost("/league/product/channel",request)
}

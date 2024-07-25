import {Application} from "~/api/application.ts";
import {ClientPlatform} from "~/utils/constant.ts";
import {MediationSiteNetwork} from "~/api/mediatonSiteNetwork.ts";


export  interface MediationSite{
    id?:number
    applicationInfo?:Application
    clientPlatform?:ClientPlatform
    networks?:MediationSiteNetwork[]
    createTime?:string
    name?:string
}

export  interface MediationSiteSearch{
    companyId?:number
    keyword?:string
}
export  interface MediationSiteInfo extends MediationSite{

}


export interface CreateAdAppRequest{
    appIds?:string,
    clientPlatforms:ClientPlatform[]
}


export async function getSiteList(search?:MediationSiteSearch){
    return useGet<MediationSite[]>("/ad/site",search)
}


export async function getMediationSites(companyId?:string){
    return useGet<MediationSite[]>("/ad/site",{companyId:companyId})
}

export async function getMediationSiteInfo(appId:string){
    return useGet<MediationSiteInfo>(`/ad/site/${appId}`)
}

export  async function createAdApplication(request:CreateAdAppRequest){
    return usePost<string>("/ad/site/create",request)
}
import {
    BasePageRequest,
    PageWarp,
    ResponseBody
} from "~/utils/constant.ts";


/**
 * 状态
 */
export enum WidthdrawStatus{
    //审核中
    audit=1,
    //转账中
    transfer=2,
    //转账成功
    success=3,
    //转账失败
    fail=4,
    //已驳回
    reject=5
}

export const getStatusText=(type:WidthdrawStatus)=>{
    switch (type) {
        case WidthdrawStatus.audit:
        return "审核中"
        case WidthdrawStatus.transfer:
        return "转账中";
        case WidthdrawStatus.success:
        return "转账成功"
        case WidthdrawStatus.fail:
        return  "转账失败"
        case WidthdrawStatus.reject:
        return  "已驳回"
    }
}



export interface WithdrawSearch extends BasePageRequest {
    appId?:string|number
    companyId?:string|number
    phone?:string
    status:WidthdrawStatus
}


export interface WithDrawAuditRequest{
    id:number
    bizNo?:string
    bizType?: number
    remark?:string
    isPass: number| boolean
}

export interface WithdrawCountItem {
    audit?: number,
    auditRejected?: number,
    transferFail?: number,
    transferIng?: number,
    transferSuccess?: number,
}

export async function getWithdrawList(params: WithdrawSearch){
    return useGet<any>("/user/wallet/withdraw/list", params)
}
/**
 * 保存
 * @param request
 */
export async function saveWithdrawAudit(request:WithDrawAuditRequest){
   return usePost("/user/wallet/withdraw/audit",request)
}


/**
 * 提现统计
 * @param request
 */
export async function getWithdrawListCount(){
    return useGet<WithdrawCountItem>("/user/wallet/withdraw/count",)
 }
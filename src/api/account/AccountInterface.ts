import {BasePageRequest, PageWarp} from "~/utils/constant.ts";
import AccountInfo from "~/pages/account/account-info.vue";
export interface AuthToken {
    accessToken:string
    expiresIn:string
    refreshToken:string
}
export interface AccountListResponse {
    /**
     * 昵称
     */
    nickName:string

    /**
     * 头像
     */
    avatar:string
    /**
     * 登录账号
     */
    loginName:string

    /**
     * 是否启用Google安全验证
     */
    isEnableGoogleVerify:boolean

    /**
     * 角色名称
     */
    roleName:string

    /**
     * 角色Id
     */
    roleId:number|unknown|undefined

    createTime:string
}

/**
 * 账号安全检测
 */
export interface AccountSafeCheckResponse{
    /**
     * 是否需更新密码
     */
    isNeedUpdatePassword:boolean
    /**
     * 是否需要绑定google验证码
     */
    isNeedBindGoogleVerify:boolean

    /**
     * 是否需要验证
     */
    isNeedVerify:boolean

}

/**
 * 账户信息
 */
export interface AccountInfo  extends AccountListResponse{

    /**
     * 权限集
     */
    permissions:string[]


}

export interface AccountFromData{
    nickName?:string

    /**
     * 头像
     */
    avatar?:string
    /**
     * 登录账号
     */
    loginName?:string

    /**
     * 是否启用Google安全验证
     */
    isEnableGoogleVerify:boolean

    /**
     * 角色Id
     */
    roleId?:number|unknown|undefined
}

/**
 * 账号登录日志
 */
export interface AccountLoginLog{

}


/**
 * 角色
 */
export interface RolInfo{
    /**
     * 角色Id
     */
    id:number
    /**
     * 角色名称
     */
    name:number
    /**
     * 权限字符
     */
    permissions:string
    /**
     * 是否是超级管理员
     */
    isAdmin:boolean
    /**
     * 绑定的账号数量
     */
    accountCount:number
    /**
     * 是否是系统默认
     */
    isDefault:boolean
    /**
     * 创建时间
     */
    createTime:string
}

/**
 * 员工账号查询参数
 */
export interface StaffSearch extends BasePageRequest{
    /**
     * 晚称/登录账号
     */
    keyword?:string
    /**
     * 角色
     */
    roleId:number|unknown|undefined
}


/**
 * Token
 */
export interface TokenResponse{
    /**
     * token
     */
    token:string
}



/**
 * 绑定google安全验证码
 * @param googleSecretKey 密钥
 * @param verifyCode 动态验证码
 */
export function bindGoogleVerify(googleSecretKey:String,verifyCode:string){
    return usePost("/account/bindGoogleVerify",{"googleSecretKey":googleSecretKey,"verifyCode":verifyCode})
}



/**
 * 修改当前登录人密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @param verifyCode  安全验证码 如果启用了google安全验证码需要
 */
export function updatePassword(oldPassword?:string, newPassword?:string,verifyCode?:string) {
    return usePost<String>("/account/update/password",{"oldPassword":oldPassword,"newPassword":newPassword})
}

/**
 * 重置账号密码
 * @param longName 登录账号
 * @param password 密码
 * @param verifyCode  安全验证码
 */
export function  resetPassword(longName:string,password:string,verifyCode:string){
    return usePost<String>("/account/reset/password",{"password":password,"verifyCode":verifyCode,"longName":longName})
}



/**
 * 分页查询账户列表
 * @param params {@link OrderSearch}
 */
export function searchStaff(params:StaffSearch) {
    return useGet<PageWarp<AccountListResponse>>('/staff/page', params)
}

/**
 * 创建员工账号
 * @param data
 */
export function saveStaff(data:AccountFromData) {
    return usePost<String>("/staff", data)
}

/**
 * 重置员工账号密码
 * @param id
 * @param newPassword
 */
export function resetStaffPassword(id:number|string|unknown,newPassword?:string) {
    return usePut<String>("/staff/reset/password", {"id":id,"password":newPassword})
}
/**
 * 登录
 * @param params
 */
export function login(loginName:string,password:string){
    return usePost<AuthToken>('/auth/token', {"loginName":loginName,"password":password})
}

/**
 * 获取账户详情
 * @param accountId
 */
export function getAccountInfo(){
    return useGet<AccountInfo>("/account/info")
}

/**
 * 获取用户登录日志
 * @param accountId
 * @param params
 */
export function getAccountLoginLog(accountId:number|string|unknown,params:BasePageRequest){
    return useGet<AccountLoginLog>(`/account/login/log/${accountId}`,params)
}


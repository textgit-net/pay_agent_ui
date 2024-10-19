import {PageWarp, PayChannelType} from "~/utils/constant.ts";

export interface AuthToken {
    accessToken:string
    expiresIn:string
    refreshToken:string
}


export interface AccountInfoResponse {
    id:number
    loginName:string
    nickName:string
    avatar?:string
    permissions?:any
    accountStatus:number
    lastLoginTime:string
    isAdmin:boolean
    isEnableGoogleVerify:boolean
    roleId:number
    roleName:string
    createTime:string
    // 是否允许发展子代理
    isAllowInviteUser: boolean
}

export interface RoleInfoResponse{
    id:number
    name:string
    permissions:string
    isAdmin:string
    isDefault:string
}

export interface PermissionsGroup{
    name:string
    description:string
    metadataList:PermissionsMetadata[]
}
export interface PermissionsMetadata{
    Key:string
    description:string
}
/**
 * 登录
 * @param loginName loginName
 * @param password 密码
 */
export function login(loginName:string,password:string){
    return usePost<AuthToken>('/auth/token', {"loginName":loginName,"password":password})
}

/**
 * 获取登录的用户信息
 */
export function getAccountInfo(){
    return useGet<AccountInfoResponse>("/account/info")
}

/**
 * 获取账号列表
 */
export function getAccountList(){
    return useGet<AccountInfoResponse[]>("/account/list")
}


/**
 * 获取角色列表
 */
export function getAccountRoleList(){
    return useGet<RoleInfoResponse[]>("/account/role/list")
}

/**
 * 获取权限资源
 */
export function getPermissionResource(){
    return useGet<PermissionsGroup[]>("/system/permissions")
}


import { ResponseBody} from "~/utils/constant.ts";

export interface GoogleSecretKeyRespone {
    secretKey?:string;
    qeCode?:string;
}


export interface GoogleSecretCodeRequest{
    googleSecurityKey:string;
    // 安全码
    secretCode:string;
}


/**
 * 获取google安全验证码
 */
export function getGoogleSecretKey(): Promise<ResponseBody<GoogleSecretKeyRespone>>{
    return useGet<GoogleSecretKeyRespone>("/security/googleSecretKey")
}

/**
 * 绑定google安全验证码
 */
export function bigdGoogleSecretCode(data?: GoogleSecretCodeRequest): Promise<ResponseBody<any>>{
    return usePost<any>("/security/bind/googleSecretCode", data)
}


/**
 * 启用-禁用google安全验证
 */
export function changeGoogleVerifyStatus(): Promise<ResponseBody<any>>{
    return useGet<any>("/security/change/googleVerify")
}

/**
 * google安全码验证,body传入securityCode
 */
export function verifyGoogleCode(securityCode: string): Promise<ResponseBody<any>>{
    return usePost<any>("/auth/verifyGoogleCode", {'securityCode': securityCode})
}



/**
 * 重置密码
 */
export function resetPassword(password: string): Promise<ResponseBody<any>>{
    return usePost<any>("/auth/resetPassword", {'password': password})
}
import { defHttp } from "@/utils/http";

enum Api {
    Login = "/system/login",
    VerifyToken = "/system/verifyToken",
    GetCaptcha = "/system/getCaptcha",
    GetUserInfo = "/user/getUserInfo",
}

export function login(data: any) {
    return defHttp.post({ url: Api.Login, data },{ successMessageMode:'message'});
}

export function verifyToken(token:string | null){
    return defHttp.post({ url: Api.VerifyToken, data:{token}},{ successMessageMode:'message'});
}

export function getCaptchaApi(){
    return defHttp.post({url: Api.GetCaptcha}, { successMessageMode:'none', isTransformResponse:false});
}

export function getUserInfo(data:any){
    return defHttp.post({ url: Api.GetUserInfo, data }, { successMessageMode:'none'});
}
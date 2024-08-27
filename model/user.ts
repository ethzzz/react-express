import { jwtConfig } from './../config/jwtConfig';
import { nestAdmin as db } from "../utils"
import { async } from "../framework/ms"
import { AsyncResultCallback } from "async"
import { createTokenCheck } from '../config/jwtConfig'
import { execute } from '../utils';

export const createUser = (args:any,callback:Function)=>{

}

export const getUserInfo = (args:any,callback:AsyncResultCallback<any>) =>{
    async.waterfall([
        (cb:AsyncResultCallback<any>)=>{
            cb(null,args.data.username)
        },
        (username:string,cb:AsyncResultCallback<any>)=>{
            let name = 'getUserInfo'
            execute(name,db,`select * from sys_user where username = ?`,[username],(err:any,result:any)=>{
                if(err){
                    return cb(err)
                }
                return cb(null,result)
            })
        }
    ],callback)
}
import { AsyncResultCallback } from "async"
import { execute } from "../utils"
import async from 'async'
import { nestAdmin } from "../utils"

export const checkAccountExists = async (username: string, callback: AsyncResultCallback<boolean, any>) => {
    async.waterfall([
        (cb:AsyncResultCallback<any, any>)=>{
            execute('checkAccountExists', nestAdmin ,'select * from sys_user where username = ?', [username],cb)
        },
        (user:any,cb:AsyncResultCallback<boolean, any>)=>{
            if(user.length > 0){
                return cb(null,true)
            }
            cb(null,false)
        }
    ],callback)
}
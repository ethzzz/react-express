import async, { AsyncResultCallback } from 'async'
import { getLogger } from 'log4js'
import { IncomingForm } from 'formidable'
import path from 'path'
import { uploadFileNew, upConfig, fileConfig } from '@/utils'

const log = getLogger('model/upload')

export const uploadFile = (req:any,callback:AsyncResultCallback<any,any>)=>{
    async.waterfall([
        (cb:AsyncResultCallback<any,any>)=>{
            uploadFileNew(req,upConfig,fileConfig,cb)
        }
    ],(err,result)=>{
        if(err){
            return callback(err)
        }
        callback(null,result)
    })
}


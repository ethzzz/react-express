import { createPoolList } from '../config/db'
import async, { AsyncResultCallback } from 'async'
import { getLogger } from 'log4js'

const DataBaseLog = getLogger('framework/db_base')

export const db_server = {
    mysql: {},
}

export const mysql : any = {}

export const init_db = (callback:AsyncResultCallback<any>) => {
    async.waterfall([
        (cb:Function)=>{
            createPoolList({},undefined,cb)
        },
        (pool:any,cb:Function)=>{
            // console.log(pool)
            Object.keys(pool).forEach(key=>{
                mysql[key] = pool[key]
            })
            DataBaseLog.info('mysql connect success')
            cb()
        }
    ],callback)
}

export default {
    init_db,
    mysql,
}
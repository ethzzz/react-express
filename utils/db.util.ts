import { PoolConnection } from 'mysql2'
import { getLogger } from 'log4js'

const log = getLogger('utils/db')

export const query = (name:string, dbm:PoolConnection, sql:any, callback:Function) =>{
    log.info(name, JSON.stringify(sql))
    dbm.query(sql, (err, result) => {
        if(err){
            callback(err)
            return
        }
        callback(null,result || [])
    })
}

export const execute = (name:string, dbm:PoolConnection, sql:any, params:any,callback:Function) =>{
    log.info(name, JSON.stringify(sql), JSON.stringify(params))
    dbm.execute(sql, params, (err, result) => {
        if(err){
            callback(err)
            return
        }
        callback(null,result || [])
    })
}
import { PoolConnection } from 'mysql2'

export const query = (name:string, dbm:PoolConnection, sql:any, callback:Function) =>{
    console.info(name, JSON.stringify(sql))
    dbm.query(sql, (err, result) => {
        if(err){
            callback(err)
            return
        }
        callback(null,result || [])
    })
}

export const execute = (name:string, dbm:PoolConnection, sql:any, params:any,callback:Function) =>{
    console.info(name, JSON.stringify(sql), JSON.stringify(params))
    dbm.execute(sql, params, (err, result) => {
        if(err){
            callback(err)
            return
        }
        callback(null,result || [])
    })
}
const mysql = require("mysql2")
import async from 'async'

const poolConfig = {
    // 主机
    host: "127.0.0.1",
    // 账号
    user: "root",
    // 密码
    password: "123456",
    // 数据库
    database: "nest_admin",
    // 端口号
    port: 3306,
    waitForConnections: true,
    // 最大空闲连接数
    connectionLimit: 10,
    // 最大连接数
    maxIdle: 10,
    // 空闲连接超时时间
    idleTimeout: 10000,
    // 连接超时时间
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
}

export const databasesConfig = ['nest_admin']
export const dbPoolList = {}

const createPool = (options = {}) => {
    return mysql.createPool({
        ...poolConfig,
        ...options
    })
}

const createConnection = (options?:any) => {
    return mysql.createConnection({
        // 主机
        host: "127.0.0.1",
        // 账号
        user: "root",
        // 密码
        password: "123456",
        // 数据库
        database: "nest_admin",
        // 端口号
        port: 3306,
        // 超时时间
        connectTimeout: 10000,
        multipleStatements: true
    })
}

export const init_db = (callback:Function)=>{
    createConnection().connect((err:Error)=>{
        if(err){
            console.log(err)
            return callback(err)
        }
        console.log("mysql connect success")
        callback()
    })
}

export const createPoolList = (options:any, databases = databasesConfig, callback:Function) => {
    let connectObj : any = {}
    async.eachSeries(databases, (item, cb) => {
        createPool({...options, database: item}).getConnection((err:Error, connection:any) => {
            try{
                if (err) {
                    return cb(err)
                }
                connectObj[item] = connection
                cb()
            }catch(e:any){
                console.log(e)
                // throw new Error(e)
                cb(e)
            }
        })
    }, (err)=>{
        if(err){
            return callback(err)
        }
        callback(null, connectObj)
    })
}

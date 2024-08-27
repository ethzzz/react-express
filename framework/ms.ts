import express from 'express'
import session from 'express-session'
import redis from 'redis'
import async from 'async'
import * as log4js from 'log4js'
import events from 'events'
import http from 'http'
import db from '../framework/db_base'
import logger from 'logger'

log4js.configure({
    appenders: { 
        console: { type: 'console' },  // 输出到控制台
        cheese: { type: 'file', filename: 'cheese.log' } // 输出到文件
     },
    categories: { 
        default: { appenders: ['console','cheese'], level: 'debug' },
    },
    pm2: true
})

export {
    express,
    session,
    redis,
    async,
    events,
    http,
    db,
    logger
}

export const log = log4js.getLogger()
import { RequestProps, ResponseProps } from "#/request"
import RabbitMQ from "@/utils/rabbitmq.util"
import type { Channel } from "amqplib"
import async, { AsyncResultCallback } from 'async'
import { getLogger } from "log4js"
// const { getLogger } = require("log4js") 

const log = getLogger("routes/modules/rabbitmq")

let channel:Channel;
let queueName:string = 'task_queue';
let routingKey = 'ethz';

(async ()=>{
    channel = await RabbitMQ.createChannel()
    await channel.assertQueue(queueName,{
        durable:true // 队列持久化
    })
    channel.consume(queueName,(msg:any)=>{
        log.info(queueName,msg.content.toString())
        channel.ack(msg)
    })
    /**
     * 声明一个交换机
     * @param {String} exchange 交换机名称 
     * @param {String} type "direct" | "topic" | "headers" | "fanout" | "match" | 使用广播模式
     * @param {String} options 参数
     */
    channel.assertExchange('logs', 'direct', {
        durable: true // 开启消息持久化
    })

    // 声明一个队列
    channel.assertQueue('queue1', {
        durable: true
    })
    channel.assertQueue('queue2', {
        durable: true
    })
    channel.assertQueue('queue3', {
        durable: true
    })

    // 绑定队列和交换机
    channel.bindQueue('queue1', 'logs', routingKey)
    channel.consume('queue1', (msg:any)=>{
        log.info("queue1",msg.content.toString())
    },{
        noAck: true
    })

    channel.bindQueue('queue2', 'logs', routingKey)
    channel.consume('queue2', (msg:any)=>{
        log.info("queue2",msg.content.toString())
    },{
        noAck: true
    })

    channel.bindQueue('queue3', 'logs', routingKey)
    channel.consume('queue3', (msg:any)=>{
        log.info("queue3",msg.content.toString())
    },{
        noAck: true
    })


    //-- 延时消息队列
    channel.assertExchange('delay','x-delayed-message',{
        arguments:{
            // 目标交换机类型
            'x-delayed-type':'direct'
        }
    })

    // 消费延时消息
    // 创建一个队列
    const { queue:delay } = await channel.assertQueue('delay')
    // 队列名称 - 交换机名称 - routingKey
    channel.bindQueue(delay, 'delay', routingKey)
    channel.consume('delay', (msg:any)=>{
        log.info("delay",msg.content.toString())
    },{
        noAck: true
    })

    return channel
})()
    


export const send = (req:RequestProps,res:ResponseProps)=>{
    let body : any = req.body || {}
    if(!body.message){
        return res.send({code:1,msg:"message不能为空"})
    }
    async.waterfall([
        (next:any)=>{
            channel.sendToQueue(queueName, Buffer.from(body.message),{
                persistent:true  // 消息持久化
            })
            next(null)
        },
        (next:any)=>{
            channel.publish('logs', routingKey, Buffer.from(body.message))
            next()
        },
        // 给延时消息队列发送消息
        (next:any)=>{
            channel.publish('delay', routingKey, Buffer.from('延时消息: '+ body.message ),{
                headers:{
                    'x-delay':10000
                }
            })
            next(null)
        }
    ],(err:any)=>{
        if(err){
            return res.send({code:1,msg:err})
        }
        return res.send({code:0,msg:"ok"})
    })
}
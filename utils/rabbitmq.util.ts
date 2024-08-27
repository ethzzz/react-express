import amqblib, { Connection} from 'amqplib'
import { getLogger } from "log4js"

const log = getLogger("utils/rabbitmq")

class RabbitMQ {
    // 单例
    static connection : Connection | null = null;
    constructor(){
        // this.connection = null
    }

    static async getConnection() {
        if(!RabbitMQ.connection){
            log.info("RabbitMQ getConnection....")
            RabbitMQ.connection = await amqblib.connect('amqp://localhost')
            log.info("RabbitMQ getConnection success")
        }
        return RabbitMQ.connection
    }

    static async closeConnection() {
        if(RabbitMQ.connection){
            await RabbitMQ.connection.close()
        }
    }

    static async createChannel() {
        const connection = await RabbitMQ.getConnection()
        return await connection.createChannel()
    }
}

export default RabbitMQ
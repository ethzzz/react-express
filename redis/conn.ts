import { Redis } from "ioredis";
import { getLogger } from "log4js";

const log = getLogger("redis/conn");

// lib/common/CacheManager.ts
import ioredis from "ioredis";

class CacheManager
{
    //单例
    static instance : CacheManager;
    constructor()
    {
    }
    static GetInstance():CacheManager
    {
        if (CacheManager.instance == null)
        {
            CacheManager.instance = new CacheManager();

        }
        return CacheManager.instance;
    }

    //mysql数据库对象
    redis:Redis | null = null;

    InitRedis(callback:Function)
    {
        //new一个redis对象,可以配置一些参数,也可以保持默认值
        this.redis = new ioredis(
            {
            port: 6379, // Redis port
            host: "127.0.0.1", // Redis host
            family: 4, // 4 (IPv4) or 6 (IPv6)
            password: "123456",
            db: 0,
            }
        );

        //错误监听
        this.redis?.on("error", function (err:any)
        {
            log.error("Error ", err);
            return callback(err)
        });

        this.redis?.on("ready", function (err:any)
        {
            log.info("redisCache connection succeed")
            callback()
        });
    }
}

//初始化
// CacheManager.GetInstance().InitRedis(() =>
// {
//     console.log("redisCache init succeed")
// });

//导出RedisManager这个单例对象,其他的文件中使用这个导出的对象即可
export default CacheManager.GetInstance();

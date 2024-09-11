import { create } from './common/common_app'
import async from 'async'
import redisCache from './redis/conn'
import { initWebsocket, initWebsocket2, initWebsocket3 } from './common/websocket'
import { log } from './framework/ms'
import portfinder from 'portfinder'

var app = exports.app = create(__dirname)
portfinder.basePort = 3000;


app.et.on('common_init_ready',function(){
  init()
})

function init(){
  async.waterfall([
    (cb:Function)=>{
      redisCache.InitRedis(cb)
    },
    (cb:Function)=>{
      initWebsocket2(cb)
    },
  ],(err:any)=>{
    if(err){
      log.error(err)
    }
    // app.keep_url_case = true//不转成小写
    portfinder.getPort((err:any,port:number)=>{
      if(err){
        log.error(err)
        return 
      }
      app.listen(port,()=>{
        log.info(`app listen ${port}`)
      })
    })
  })
}
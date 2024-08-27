import { create } from './common/common_app'
import async from 'async'
import redisCache from './redis/conn'
import { initWebsocket, initWebsocket2, initWebsocket3 } from './common/websocket'
import { log } from './framework/ms'

var app = exports.app = create(__dirname)

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
    app.listen(3000,()=>{
      log.info('app listen 3000')
    })
  })
}
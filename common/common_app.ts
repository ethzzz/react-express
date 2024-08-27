import express from 'express'
import path from 'path'
import { noAuthRoutes } from '../config/auth'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { jwtConfig } from "../config/jwtConfig"
import { expressjwt as expressJWT } from "express-jwt"
import  session from 'express-session'
import { events, log } from '../framework/ms'

function app_setting(app:any,data:any){
    for(var k in data){
        app.set(k,data[k])
    }

    app.default_404 = '<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr /><center>nginx</center></body></html>'

    app.process_404 = function(req:Request,res:any,next:Function){
        res.on('evt_404',function(){
            res.send(app.default_404)
        })
        next()
    }
}

function app_init_route(this:any){
    var self = this
    var use_js = false
    var use_session

    var r = require('@/routesConfig')
    use_js = true
    r.routes = r.routes || []
    self.all_routes = self.all_routes || {}
    self.params_routes = self.params_routes || []
    for(var i = 0; i< r.routes.length; ++i){
        // 获取module name
        var mod_name = r.routes[i].module
        var action_mod = require(self.dir + '/routes/' + mod_name )
        action_mod.type         = r.routes[i].method
        action_mod.url          = r.routes[i].url
        action_mod.use_session  = r.routes[i].use_session

        self.all_routes[r.routes[i].url] = 1
        var dii = r.routes[i].url.indexOf('/:')
        if(dii > 0){
            self.params_routes.push(r.routes[i].url.substring(0, dii))
        }

        var act_name = r.routes[i].action
        var action = action_mod[act_name]
        if (!action) {
            log.error('route error:', action_mod.type, action_mod.url, mod_name, act_name)
            return
        }

        var func = self[action_mod.type]
        if (func) {
            log.info('\troute:', action_mod.type, action_mod.url, mod_name, act_name)
            func.call(self, action_mod.url, action)
        }

        self.action_mods = self.action_mods || {}
        self.action_mods[mod_name] = action_mod
        
        // if (!action_mod.use_session) {
        //     ms.express.session.ignore.push(action_mod.url)
        // } else {
        //     use_session = true
        // }
    }

    // if (!use_session) {
    //     ms.u2.remove_middleware(self, 'session')
    // }

    process.nextTick(function() {
        // 触发路由准备
        self.et.emit('route_ready')
    })

    return self
}
//--------------------------------------------------------------------------------------------------------------------------------
export const create = function(app_dir:string, url_map?:any, access_config?:any, conf?:any) {
    var app_setting_data = {
        'views'        : app_dir + '/views',
        'view engine'  : 'pug',
        'view options' : { layout : false},
        'port'         : 3000
    }

    var app_static_dir = app_dir + '/public'
    var stylus_src_dir = app_dir + '/public'
    var _app_static_dir = app_dir + '/_public'

    var app = express() as unknown as any
    app.et = new events.EventEmitter()
    app.on('request', function(req:Request, res:Response) { app.et.emit('request', req, res) })
    
    app.dir = app_dir
    app._conf = conf || {}
    app_setting(app, app_setting_data)
    app.init_route = app_init_route

    // var mem_store = new ms.express.session.MemoryStore()
    // var gc        = new ms.express.session.GC(mem_store) // add by qingyun to clear expire session
    // var mem_store = new ms.mongo_session()
    // var redis_store = new ms.redis_store(ms.dbserver_config.redis && ms.dbserver_config.redis.session)

    // app.mem_store = mem_store
    // return;
    if(process.env.NODE_ENV == 'development'){
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(session({ secret: 'thz', resave: true , saveUninitialized: true}))
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(expressJWT({secret: jwtConfig.jwtSecretKey, algorithms: ['HS256']}).unless({path: noAuthRoutes}))
        app.use((err:Error,req:any,res:any,next:Function)=>{
            if(err.name === "UnauthorizedError"){
                res.status(401).send("invalid token")
            }
        })
        // app.use('/',app.router)
        app.use(app.process_404)
        // app.use(errorHandler({ dumpExceptions: true, showStack: true }))
    }else{
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(session({ secret: 'thz', resave: true , saveUninitialized: true}))
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(expressJWT({secret: jwtConfig.jwtSecretKey, algorithms: ['HS256']}).unless({path: noAuthRoutes}))
        app.use((err:Error,req:any,res:any,next:Function)=>{
            if(err.name === "UnauthorizedError"){
                res.status(401).send("invalid token")
            }
        })
        // app.use('/',app.router)
        app.use(app.process_404)
        // app.use(errorHandler({ dumpExceptions: true, showStack: true }))
    }
    app.init_route()
    app.et.on('route_ready', function() {
        // if (ms.common_config.use_request_stat) {
        //     require('request_stat.js').init(app)
        // }
        // app.listen(app_setting_data.port)
        app.et.emit('common_init_ready')
    })

    return app
}
// -----------------------------------------------------------------------------------------------------------------------------------
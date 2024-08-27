import * as model from "m/system"
const { createTokenCheck } = require("../../config/jwtConfig")
import { checkArgs } from '@/utils'
import { getLogger } from "log4js"

const log = getLogger('[routes/modules/system]')

// login
exports.login = (req:any,res:any) =>{
    let args = req.body
    console.log("req.session.captcha",req.session.captcha)
    if(!args.username || !args.password){
      return res.send({code:1,msg:"username或password不能为空"})
    }
    model.login(req,args,(err:any,result:any)=>{
      if(err){
        return res.send({code:1,message:err})
      }
    //   res.setHeader("Authorization",result)
      return res.send({code:0,result:result})
    })  
}

// verifyToken
exports.verifyToken = (req:any, res:any) => {
    // createTokenCheck.checkToken(req.headers.authorization, (err, decoded) => {
    //     if (err) {
    //         return res.send({code: 1, msg: err})
    //     }
    //     return res.send({code: 0, msg: 'ok'})
    // })
    return res.send({code: 0, message: '已登录'})
}


// get captcha
exports.getCaptcha = (req:any,res:any)=>{
  let body = req.body
  model.getCaptcha(body,(err:any,result:any)=>{
    if(err){
      return res.send({code:1,msg:err})
    }
    req.session.captcha = result.text
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.send({code:0,data: result.data})
  })
}

// register
export const register = (req:any,res:any)=>{
  let body = req.body
  log.info('register body',body)
  if(!checkArgs(body,["username","password"])){
    return res.send({code:1,msg:"username或password不能为空"})
  }
  model.register(body,(err:any,result:any)=>{
    if(err){
      return res.send({code:1,msg:err})
    }
    return res.send({code:0,msg: '注册成功'})
  })
}
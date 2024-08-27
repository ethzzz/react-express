import * as model from "../../model/user"
var cache = require('../../redis/conn')

/* GET users listing. */
exports.index = function(req:any, res:any, next:any) {
  res.send('respond with a resource');
};

exports.getKey =  (req:any, res:any) => {
  cache.redis.get(req.params.key, (err:any, data:any) => {
    if (err) {
      res.send(err)
    } else {
      res.send({
        data:data
      })
    }
  })
}

exports.setKey = (req:any, res:any) => {
  cache.redis.set(req.body.key, req.body.value, (err:any, data:any) => {
    if (err) {
      res.send(err)
    } else {
      res.send({
        result:data
      })
    }
  })
}

exports.getUserInfo = (req:any, res:any) => {
  let body = req.auth;
  console.log("body",body)
  model.getUserInfo(body,(err:any,result:any)=>{
    if(err){
      return res.send({code:1,msg:err})
    }
    return res.send({code:0,result:result})
  })
}

exports.createUser = (req:any,res:any)=>{
  let args = req.body
  if(!args.username || !args.password){
    return res.send({code:1,msg:"username或password不能为空"})
  }
  model.createUser(args,(err:any,result:any)=>{
    if(err){
      return res.send({code:1,msg:err})
    }
    return res.send({code:0,result:result})
  })
}


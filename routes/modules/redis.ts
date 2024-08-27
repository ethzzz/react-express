import cache from '../../redis/conn'

exports.getKey = (req:any, res:any) => {
    cache.redis?.get(req.params.key, (err:any, data:any) => {
        if (err) {
            res.send(err)
        } else {
            res.send({
                code: 0,
                data: data
            })
        }
    })
}

exports.setKey = (req:any, res:any) => {
    let body = req.body
    if(!body.key || !body.value){
        return res.send({code:1,msg:"key不能为空,value不能为空"})
    }
    cache.redis?.set(body.key, body.value, (err:any, data:any) => {
        if (err) {
            res.send(err)
        } else {
            res.send({
                code:0,
                msg:"ok"
            })
        }
    })
}

// list
exports.list =  (req:any, res:any) => {
    let body = req.body
    if(!body.key || !body.value){
        return res.send({code:1,msg:"key不能为空,value不能为空"})
    }
    cache.redis?.lpush(body.key, body.value, (err:any, data:any) => {
        if (err) {
            res.send(err)
        } else {
            res.send({
                code:0,
                msg:"ok"
            })
        }
    })
}
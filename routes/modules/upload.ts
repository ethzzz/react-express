const fs = require("fs")
const path = require("path")
import * as model from '../../model/upload'

// const filePath = path.resolve(__dirname, "../public/upload/");

export const uploadFile = (req:any, res:any) => {
    model.uploadFile(req,(err,result)=>{
        if(err){
            return res.send({
               code: 1,
               msg: '上传失败',
            })
        }
        return res.send({
           code: 0,
           msg: '上传成功',
           data: result
        })
    })
}

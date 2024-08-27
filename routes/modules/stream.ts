// 'use strict';
import fs from "fs"
import path from "path"

exports.getFile = (req:any, res:any) => {
  const fileName = path.resolve(__dirname, "./stream.js");
  fs.readFile(fileName, (err:any, data:any) => {
    res.end(data);
  });
}

exports.getFileStream = (req:any,res:any)=>{
    const fileName = path.resolve(__dirname, `./${req.params.name}`);
    const rs = fs.createReadStream(fileName);
    rs.on("data",(chunk)=>{
        console.log("chunk:",chunk)
    })
    rs.pipe(res)
}

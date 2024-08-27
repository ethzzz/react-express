const fs = require("fs");
import path from "path"
import async, { AsyncResultCallback } from "async"

exports.getAllRoutes = (app:any,callback:Function) => {
  const dirs = fs.readdirSync(path.join(__dirname, "./modules"));

//   console.log(dirs)
  async.each(
    dirs,
    function (file:any, callback:Function) {
      const filePath = path.resolve(__dirname, `./modules/${file}`);
      if (fs.statSync(filePath).isDirectory()) {
        // exports.getAllRoutes(app, filePath);
      } else {
        console.log(`/api/${file.split('.')[0]}`,filePath)
        app.use(`/api/${file.split('.')[0]}`, require(filePath));
        // console.log(routes);
      }
      callback();
    },
    function (err) {
      if (err) {
        console.log(err);
      }
      callback(null);
    }
  );
};

// 初始化所有路由
exports.init_routes = (app:any,callback:AsyncResultCallback<any>)=>{
  async.waterfall([
    (cb:Function)=>{
      const filePath = path.resolve(__dirname, "../routes.js");
        fs.readFile(filePath,"utf-8",(err:any,data:any)=>{
            if(err){
              cb(err)
            }
            cb(null,filePath)
        })
    },
    (filePath:any,cb:Function)=>{
      const { routes } = require(filePath)
      console.log(routes)
      cb(null)
    }
  ],callback)
}

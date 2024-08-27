import async, { AsyncResultCallback } from 'async'
import * as log4js from 'log4js'
import path from 'path'
import fs from 'fs'
import { IncomingForm, type Options } from 'formidable'
import { today as toDay } from './date.util'

const log = log4js.getLogger('utils/upload.util')

/*  
    up_config : 上传配置
        base_dir    : 文件存储位置（eg: /r.syyx.com/public/_att/kf/problem/） 
        date_dir    : (是否需要按天分文件夹存储，默认为否)
    fileConfig : 文件属性配置
        save_name: 保留文件名 true|false
        max_size : 可上传文件大小-上限
        typeReg : 文件类型（正则表达式）（eg：/jpg|png|bmp|jpeg|gif|txt|rar|zip|7z/）
*/

export const upConfig = {
    baseDir: 'public/upload/',
    dateDir: false
}

export const fileConfig = {
    saveName: true,
    maxSize: 1024 * 1024 * 1024 * 5,
    typeReg: /jpg|png|bmp|jpeg|gif|txt|rar|zip|7z/
}

const _retcode_msg : any = {
    '-1': '系统错误',
    '1': '空文件',
    '2': '文件类型有误',
    '3': '文件太大'
}

// formidable IncomingForm 配置
export const BaseUploadConfig: Options = {
    uploadDir: path.join(__dirname, '../public/upload'),
    encoding: 'utf-8',
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024,
}

export const uploadFileNew = (req:any,uploadConfig:any,fileConfig:any,callback:any)=>{
    log.info("start upload files...", uploadConfig,fileConfig)
    // const baseDir = path.join('public', uploadConfig.baseDir)
    const baseDir = uploadConfig.baseDir
    uploadConfig.targetDir = baseDir

    saveFileFromRequest(req,uploadConfig,(err:any,fields:any,files:any)=>{
        if(err){
            log.error('upload files err:', err.toString())
        }
        log.info('--------files--------', files)
        const filesToLoad = getFilesToLoad({}, files)
        log.info('upload files num :', filesToLoad.length)
        saveFiles(filesToLoad,uploadConfig,fileConfig,callback)
    })
}

const saveFileFromRequest = (req:any,upConfig:any,callback:any)=>{
    const form = new IncomingForm(BaseUploadConfig)
    form.parse(req,callback)
}

const getFilesToLoad = (upConfig:any, files:any) => {
    var filesToLoad = []
    for (var i in files) {
        if (i.indexOf(',') == -1) {
            if(Array.isArray(files[i]))
            for(let j = 0; j< files[i].length; ++j){
                files[i][j].tag_name = i
                filesToLoad.push(files[i][j])
            }
        }
        else {
            fs.unlinkSync(files[i].path)
        }
    }
    return filesToLoad
}

const saveFiles = (filesToLoad:Array<any>,uploadConfig:any,fileConfig:any,callback:any) => {
    // uploadConfig.http_url = path.basename + uploadConfig.targetDir.split("/../")[1].replace('public/', '')
    uploadConfig.http_url = path.resolve(__dirname, "../public/upload/")
    log.info('filesToLoad=====',JSON.stringify(filesToLoad))
    var filesUploadResult : any = {}
    if (uploadConfig.date_dir) {
        var today: any = toDay()
        uploadConfig.folder_name = today
        uploadConfig.http_url += today + "/"
        uploadConfig.targetDir += today + "/"
    }

    var fail_tag = ''
    async.eachSeries(filesToLoad, function (file, cb) {
        doSaveFile(file, uploadConfig, fileConfig, function (err:any, result:any) {
            if (err) {
                fail_tag = file.tag_name
                cb(err.toString()); return
            }
            filesUploadResult[file.tag_name] = result
            cb()
        })
    }, function (err:any) {
        if (err) {
            log.info('upload files fail :', err)
            var msg = _retcode_msg[err] || err
            callback(msg, fail_tag); return
        }
        log.info('upload files ok.', filesUploadResult)
        callback(null, filesUploadResult)
    })
}

export const doSaveFile = (file:any, up_config:any, fileConfig:any, callback:any) => {
    // console.log("file===")
    var msg = check_file(file, (fileConfig || {}))
    if (msg) {
        log.error('check_file ret :', file.originalFilename, msg)
        callback(msg); return
    }

    renameFile(file, up_config, fileConfig, callback)
}

export const check_file = (file: any, config:any) => {
    if (!file || file.size <= 0) {
        fs.unlinkSync(file.filepath)
        log.error('空文件')
        return 1
    }

    var extension = file.originalFilename.substring(file.originalFilename.lastIndexOf(".") + 1)
    file.suffix = extension.toLowerCase()
    if (config.typeReg && !(config.typeReg.test(file.suffix))) {
        fs.unlinkSync(file.filepath)
        log.error('文件格式错误', config.typeReg, file.suffix)
        return 2
    }

    if (config.type_fn && !config.type_fn(extension)) {
        fs.unlinkSync(file.filepath)
        log.error('文件格式错误', file.suffix)
        return 2
    }

    var maxSize = config.maxSize || (20 * 1024 * 1024)
    if (file.size > maxSize) {
        fs.unlinkSync(file.filepath)
        log.error('文件太大', maxSize, file.size)
        var mSize = maxSize / (1024 * 1024)
        var msg = _retcode_msg['3'] + "，不能超过" + mSize + "M"
        return msg
    }

    return 0
}

const renameFile = (file:any, upConfig:any, fileConfig:any, callback:any) => {
    log.info('upload file :', JSON.stringify(file))
    async.waterfall([
        function (cb:AsyncResultCallback<any,any>) {
            const exist = fs.existsSync(upConfig.targetDir)
            log.info('upload targetDir exists result :', upConfig.targetDir, exist)
            cb(null,exist)
        },
        function (exist:boolean, cb:AsyncResultCallback<any,any>) {
            if (exist) {
                cb(null); return
            }
            fs.mkdir(upConfig.targetDir, function (err) {
                log.info('upload mkdir result :', upConfig.targetDir, err)
                cb(err)
            })
        },
        function (cb:AsyncResultCallback<any,any>) {
            var name = ''
            if (fileConfig.saveName) {
                name = file.originalFilename.split(fileConfig.typeReg)[0].toLowerCase() + Date.now() + Math.floor(Math.random() * 100) + '.' + file.suffix
            } else {
                name = Date.now() + Math.floor(Math.random() * 100) + '.' + file.suffix
            }

            var readStream  = fs.createReadStream(file.filepath)
            var writeStream = fs.createWriteStream(upConfig.targetDir + name)

            readStream.pipe(writeStream);
            readStream.on('end',function(){ 
                fs.unlinkSync(file.filepath);
                var fileItem : any = {}
                fileItem.originalFilename = name
                fileItem.url = upConfig.http_url + name
                fileItem.today = upConfig.folder_name
                cb(null, fileItem)
            })
        }
    ], function (err,fileItem) {
        callback(err,fileItem)
    })
}
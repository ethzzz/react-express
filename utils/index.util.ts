import _ from 'lodash'

type VerifyItem = {
    name: string
    type: string
}

type Verify = Array<string | VerifyItem | any>

export const checkArgs = (args:any,verify:Verify) =>{
    if(!args || !verify) return false
    for(let i = 0; i < verify.length; ++i){
        if(_.isString(verify[i])){
            if(!args[verify[i]]) return false
            continue;
        }else{
            if(!args[verify[i].name] || Object.prototype.toString.call(args[verify[i].name]) !== `[object ${verify[i].type}]`) return false
            else continue
        }
    }
    return true
}
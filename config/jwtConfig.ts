const jwt = require('jsonwebtoken')
export const jwtConfig ={
    jwtSecretKey: 'jwtSecretKey',
    jwtExpires: 60 * 60 * 24 * 30
}


export const createTokenCheck = {
    getToken(data:any){
        return jwt.sign({data},jwtConfig.jwtSecretKey,{expiresIn:jwtConfig.jwtExpires})
    },
    checkToken(token:string,callback:Function){
        return jwt.verify(token, jwtConfig.jwtSecretKey,callback)
    }
}
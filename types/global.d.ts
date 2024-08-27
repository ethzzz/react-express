declare global {
    interface GlobalThis  {
        globalThis: Window
    
        [key: string]: any
    }
    var globalThis:GlobalThis

    interface RequestProps extends Request {
        session: {
            captcha: string
        }
    }
}

namespace DataBase {
    export const mysqlDB = ms.db.mysql
}



declare interface GlobalThis  {
    globalThis: Window

    [key: string]: any
}

type Callback<T> = (err: Error | null, result?: T) => void

declare var global : GlobalThis
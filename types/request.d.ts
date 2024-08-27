declare interface RequestProps extends Request {
    session: {
        captcha: string
    }
    [key: string]: any
}

declare interface ResponseProps extends Response {
    [key: string]: any
}
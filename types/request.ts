export interface RequestProps extends Request {
    session: {
        captcha: string
    }
    [key: string]: any
}

export interface ResponseProps extends Response {
    [key: string]: any
}
export interface CreateUserArgs {
    username: string
    password: string
    psalt: string
    avatar?:string
    email: string
    phone: string
    remark?:string
    qq?:string
    nickname?: string
    dept_id?: number
}
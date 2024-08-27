import dayjs from 'dayjs'

export const prevDay = (num:number = 0,baseDay?:any)=>{
    let base = Date.now()
    if(baseDay){
        base = (new Date(baseDay + ' 00:00:00')).valueOf()
    }
    let timeLen = 24 * 60 * 60 * 1000 * num
    let yday = base - timeLen
    let dYday = new Date(yday)

    let year = '' + dYday.getFullYear()
    let month = (dYday.getMonth() > 8) ? ('' + (dYday.getMonth() + 1)) : ('0' + (dYday.getMonth() + 1))
    let day   = (dYday.getDate() > 9)  ? ('' + dYday.getDate()) : ('0' + dYday.getDate())
    let date  = year + '-' + month + '-' + day

    return date
}

export const today = () => {
    return prevDay(0)
}

export const formatDate = (date:Date, format:string)=>{
    return dayjs(date).format(format)
}
import { defHttp } from '@/utils/http';

enum Api {
    Menu = '/system/menu'
}

export function getMenuList() {
    return defHttp.get({ url: Api.Menu });  
}
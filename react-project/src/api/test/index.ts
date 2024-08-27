import { defHttp } from "@/utils/http";

export const getKey = (name:string) => {
    return defHttp.get({ url: `/redis/key/${name}` });
}
import { defHttp } from '@/utils/http';
import { UploadFileParams } from '#/axios'

enum Api {
    UploadFile = '/upload/uploadFile'
}

export const uploadFile = (params:any) =>{
    return defHttp.uploadFiles(
        {
            url: Api.UploadFile,
        },
        params
    );
}


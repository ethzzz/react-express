import { Upload, } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import type { UploadProps,UploadFile, GetProp } from 'antd'
import { uploadFile } from '@/api/upload'
import { useMessage } from "@/hooks/web/useMessage"

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { createMessage } = useMessage()
 
export default function UploadPage() {
    const [uploadFileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const UProps: UploadProps = {
        onRemove: (file) => {
            const index = uploadFileList.indexOf(file);
            const newFileList = uploadFileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file,fileList) => {
            console.log(file,fileList)
            setFileList([...uploadFileList, ...fileList]);
            return false;
        },
        fileList:uploadFileList,
        multiple:true  
    }

    const handleUpload = async() => {
        setUploading(true)
        // return
        const formData = new window.FormData()
        for (let i = 0; i < uploadFileList.length; i++) {
            formData.append('files[]', uploadFileList[i] as FileType)
        }
        uploadFile(formData).then(res=>{
            setFileList([])
            createMessage.success("上传成功")
        }).finally(()=>{setUploading(false)})
    }

    return (
        <>
            <div className="actions">
                <Upload {...UProps}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={uploadFileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            </div>
        </>
    )
}

import { useMessage } from "@/hooks/web/useMessage"
import { getAuthToken } from "@/utils"
import { io } from "socket.io-client"
import "@/style/websocket.scss"
export default function WebSocketPage() {
    const { createMessage } = useMessage()
    const [socket,setSocket] = useState<any>(null)
    const [list,setList] = useState<Array<any>>([])
    const openWebSocket = () =>{
        // const ws = new WebSocket("ws://localhost:3000/api/websocket")
        /* if(socket){
            return useMessage().createMessage.warning('websocket已经开启')
        } */
        const ws = io("ws://localhost:3001/chat",{
            transports: ['websocket'],
            query: {
                token: getAuthToken()
            },
            forceNew: true,
            // autoConnect: false
        })
        ws.connect()
        ws.on('connect',()=>{
            console.log('连接成功')
            createMessage.success("连接成功")
            setSocket(ws)
            console.log(ws)
        })
        ws.on('message',(message)=>{
            list.push(message)
            setList([...list])
        })
        ws.on('disconnect',()=>{
            createMessage.warning("连接断开")
        })
        ws.on('connect_error',(err)=>{
            createMessage.error(JSON.stringify(err))
            const navigate = useNavigate();
            navigate('/login')
        })
        /* const manager = WebSocketManager.getInstance("ws://localhost:3001",{
            transports: ['websocket'],
            query: {
                token: getAuthToken()
            },
            forceNew: true,
            // autoConnect: false
        })
        const ws = manager.socket('/api/websocket',{})
        // setSocket(ws)
        console.log(ws)
        manager.on("reconnect",()=>{
        }) */
        // ws.io.on("connect",()=>{
        //     console.log('连接成功')
        // })
        // ws.io.on("message",(message)=>{
        //     console.log(message)
        // })
        /* ws.io.on("close",()=>{
            console.log('连接关闭')
        })
        ws.io.on("error",()=>{
            console.log('连接错误')
        }) */
    }

    const closeWebSocket = () => {
        if(socket){
            socket.close()
            setSocket({...socket})
        }
    }

    const [sendMessageValue,setSendMessageValue] = useState('')
    const sendMessage = () => {
        if(!sendMessageValue){
            createMessage.warning('发送内容不能为空')
            return;
        }
        if(socket){
            socket.emit('message',sendMessageValue)
            setSendMessageValue('')
        }else{
            createMessage.warning('websocket未开启')
            return;
        }

    }

    return (
        <>
            <div className="control">
                <Button type="primary" onClick={openWebSocket}>开启WebSocket</Button>
                <Button type="primary" onClick={closeWebSocket} danger>停止WebSocket</Button>
                <div className="sendMessage">
                    <Input style={{width:'300px',marginRight:'10px'}} value={sendMessageValue} onChange={(e)=>{setSendMessageValue(e.target.value)}} />
                    <Button type="primary" onClick={sendMessage}>发送消息</Button>
                </div>
                <div className="content">
                    <p>WebSocket状态: {socket?.connected ? <span style={{color:'green'}}>已开启</span> : '未开启'}</p>
                    <div>WebSocket列表: {list.map((item,index)=>{ 
                        return (
                            <div key={index}>
                                <span>{item.id + ' ：'}</span>
                                <span>{item.user + '发送消息：'}</span>
                                <span>{item.message}</span>
                            </div>
                        )
                        })}</div>
                </div>
            </div>
        </>
    )
}
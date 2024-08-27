import { useMessage } from "@/hooks/web/useMessage"
import { getAuthToken } from "@/utils"
import { io } from "socket.io-client"
import "@/style/chatroom.scss"
import React from "react"

export default React.memo(forwardRef(({item, onJoinRoom}:any,ref) => {
    const { TextArea } = Input;
    const { createMessage } = useMessage()

    const curRef = useRef<HTMLDivElement | null>(null)
    
    const [socket,setSocket] = useState<any>()
    // input
    const [message, setMessage] = useState('')
    const onSetMessage = useCallback((value:string)=>{
        setMessage(value)
    },[message])

    // 房间人数
    const [roomCount,setRoomCount] = useState(0)

    // 房间聊天内容
    const [roomContent,setRoomContent] = useState<Array<any>>([])
    const onSetMessageContent = useCallback((value:Array<any>)=>{
        setRoomContent([...value])
    },[roomContent])
    const [joinContent,setJoinContent] = useState<Array<any>>([])
    const onSetJoinContent = useCallback((value:Array<any>)=>{
        setJoinContent([...value])
    },[joinContent])

    useImperativeHandle(ref, () => {
        return {
            getSocketId: () => socket.id
        }
    },[socket])

    useEffect(()=>{
        const socket = io("ws://localhost:3001/chat",{
            transports: ['websocket'],
            query: {
                token: getAuthToken()
            },
            forceNew: true,
            // autoConnect: false
        })
        setSocket(socket)
        socket.on('connect',()=>{
            console.log('连接成功')
            socket.emit('join',{
                name: item.name,
                room: item.roomId
            })
        })
        // 监听加入
        const renderJoin = (message:any)=>{
            let el = document.createElement('div')
            el.className = 'join-item'
            el.innerHTML = `
                <span>${message.text}</span>
            `
            setTimeout(()=>{
                // document.getElementById(socket.id as string)?.querySelector(`.message-content`)!.appendChild(el)
                curRef.current?.querySelector(`.message-content`)!.appendChild(el)
            },0)
        }
        socket.on('join',(message)=>{
            joinContent.push(message)
            renderJoin(message)
            onSetJoinContent([...joinContent])
        })
        // 监听聊天消息
        const renderMessage = (message:any)=>{
            let el = document.createElement('div')
            el.className = message.self ? 'message-item self' : 'message-item'
            el.innerHTML = `
                <div class="user">${message.user}</div>
                <div class="text">${message.text}</div>
            `
            document.getElementById(socket.id as string)!.querySelector(`.message-content`)!.appendChild(el)
        }
        socket.on('message',(message)=>{
            console.log('receive message',message)
            renderMessage(message)
            roomContent.push(message)
            onSetMessageContent([...roomContent])
        })
    
        socket.on("groupList",(groupList:any)=>{
            setRoomCount(groupList[item.roomId].length)
            onJoinRoom(Object.keys(groupList))
        })

        socket.on("connect_error",(err)=>{
            createMessage.error("连接失败")
            return;
        })
    },[])


    // 发送消息
    const sendMeesage = () => {
        socket.emit('message',{
            text: message,
            user: item.name,
            room: item.roomId
        })
        setMessage('')
    }

    return (
        <div className="chatroom" ref={curRef} id={socket?.id}>
            <div className="chatroom-content">
                <p>{'当前房间人数: ' + roomCount }</p>
                <div className="message-content">
                </div>
            </div>
            <div className="chatroom-input">
                <TextArea style={{resize: 'none', border:'none'}} autoSize={ { minRows: 5, maxRows: 5 }}  value={message} onChange={(e)=>onSetMessage(e.target.value)}/>
                <Button  type="primary" className="send-btn" onClick={sendMeesage}>发送</Button>
            </div>
        </div>
    )
}))
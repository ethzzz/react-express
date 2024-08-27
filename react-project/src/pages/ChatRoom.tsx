import ChatRoomComponent from "./components/ChatRoomComponent"
import "@/style/chatroom.scss"
export default function ChatRoom(){

    // 昵称
    const [name, setName] = useState('')
    // 房间号
    const [roomId, setRoomId] = useState('')
    // 界面聊天窗
    const [chatRoomList, setChatRoomList] = useState<Array<any>>([])
    // 聊天室
    const [roomList,setRoomList] = useState<Array<any>>([])
    const onSetRoomList = useCallback((value:Array<any>)=>{
        setRoomList([...value])
    },[roomList])

    // const memoChartRoomCompoennt = memo(ChatRoomComponent)
    
    const joinRoom = ()=>{
        chatRoomList.push({name, roomId})
        setChatRoomList([...chatRoomList])
    }

    const childRefs = useRef<any>([])

    const showAllSocketId = ()=> {
        childRefs.current.forEach((item:any)=>{
            console.log(item.getSocketId())
        })
    }

    return (
        <>
            <div className="chatroom-header">
                <Input className="baseInput" value={name} onChange={(e)=>setName(e.target.value)} placeholder="请输入你的昵称" />
                <Input className="baseInput" value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder="请输入你要加入的聊天室" />
                <Button type="primary" onClick={joinRoom}>加入房间</Button>
                <Button type="primary" onClick={showAllSocketId}>获取房间socketId</Button>
            </div>
            <div>
                <h3>聊天室总数: {roomList.length}</h3>
                <div className="chatroom-container">
                    {chatRoomList.map((item,index)=>{
                        return (
                            <ChatRoomComponent onJoinRoom={onSetRoomList} key={index} item={item} ref={(ref) => ref ? childRefs.current[index] = ref : ''}/>     
                        )
                    })}
                </div>
            </div>
        </>
    )
}
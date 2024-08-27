type Message = {
  text: string
  room?: string
  user: string
  self?:any
}

// 服务端监听客户端的事件
export interface ClientToServerEvents {
    groupList: () => void
    join: ({name,room}:{name:string,room:string}) => void
    message: (data: Message) => void
}

// 服务端向客户端发送事件
export interface ServerToClientEvents {
    // hello: () => void;
    join: ({text:string})=> void
    groupList: (data:any) => void
    message: (data: Message) => void
}

// 服务器间事件
export interface InterServerEvents {
  ping: () => void;
}

// 客户端数据
export interface SocketData {
    name: string;
    age: number;
  }
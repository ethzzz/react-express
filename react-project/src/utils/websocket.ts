import { getAuthToken } from "@/utils"
import { Manager, Socket } from 'socket.io-client'

interface SocketManagerOptions {
    url: string
    options? :any
}
class SocketManager  {
    private static instance: Manager;
    private manager: Manager;
    constructor(url:string,options?:any){
        this.manager = new Manager(url,options)
    }

    // Static method to get the single instance of the class
    public static getInstance(url:string, options?:any) {
        if (!SocketManager.instance) {
            SocketManager.instance = new Manager(url, options);
        }
        return SocketManager.instance;
    }
}

export default SocketManager
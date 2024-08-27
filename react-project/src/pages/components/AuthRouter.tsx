import { ReactElement } from "react"
import { getAuthToken } from "@/utils"
import { useMessage } from "@/hooks/web/useMessage"
// import { useLocation } from "react-router-dom"

interface Props{
    children:ReactElement
}
export default function AuthRouter({children}:Props){
    const token = getAuthToken()
    const { pathname } = useLocation()
    const message = useMessage()

    // console.log(token,children)

    if(pathname === '/login' && !token){
        return children
    }

    if(!token){
        message.createMessage.error("未登录，请先登录")
        return <Navigate to="/login" />
    }else{
        return children
    }  
}
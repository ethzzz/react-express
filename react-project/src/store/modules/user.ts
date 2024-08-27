import { create } from 'zustand'
import { produce } from 'immer'
import { login, getUserInfo } from '@/api/sys/login'
import { router } from '@/router'

// const navigate = useNavigate()
type UserState = {
    userInfo: any
    token?:string
}

type UserAction = {
    setUserInfo: (userInfo: any) => void
    setToken: (token: string | undefined) => void
    login: (params: any) => Promise<any>
    logout: (goLogin ?: boolean)=>void
    afterLogin: (goHome?: boolean) => void
}



const useUserStore = create<UserState & UserAction>()((set,get)=>({
    userInfo: {},
    token: '',
    setUserInfo: (userInfo) => set((state) => ({ ...state, userInfo })),
    setToken: (token) => set((state) => ({ ...state, token })),
    login: async (params:any) => {
        const res = await login(params)
        set(produce((state) => {
            state.token = res
            state.userInfo.username = params.username
            localStorage.setItem('token', state.token)
        }))
        return get.call(this).afterLogin()
    },
    afterLogin: async (goHome?:boolean) => {
        const userInfo = await getUserInfo(get().userInfo)
        set(produce((state) => {
            state.userInfo = { ...state.userInfo, ...userInfo } 
        }))
        router.navigate(goHome ? '/home' : get().userInfo.homePath || '/test')
        return userInfo
    },
    logout:(goLogin = false)=>{
        get().setToken(undefined)
        localStorage.removeItem('token')
        if(goLogin) {
            // history.pushState({}, '', '/login')
            // location.href = '/login'
            router.navigate('/login')
        }
        location.href = '/login'
        router.navigate('/login')
        // navigate('/login')
    }
}))

export default useUserStore
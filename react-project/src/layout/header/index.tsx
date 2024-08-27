import './index.scss'
import useUserStore from '@/store/modules/user'
export default function Header() {
    const userInfo = useUserStore(state => state.userInfo)
    const logOut = useUserStore(state => state.logout)
    return (
        <div className="header">
            <div className='left'>
            </div>
            <div className="right">
                <span>{userInfo?.username}</span>
                <Button type="primary" onClick={()=>logOut()}>退出</Button>
            </div>  
        </div>
    )
}
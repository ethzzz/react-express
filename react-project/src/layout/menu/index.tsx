import { Menu } from "antd";
import menuItems from  '@/config/menu.ts';

export default function MenuComponent(){
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const routeName = window.location.pathname;
        console.log(activeMenu);
        setActiveMenu(routeName);
    },[activeMenu]);

    const selectMenu = ({key}:{key:string}) => {
        navigate(key)
        setActiveMenu(key)
    } 

    return (
        <Menu theme="dark" mode="inline" style={{textAlign: 'center'}}  selectedKeys={[activeMenu]} items={menuItems} onClick={selectMenu}/>
    )
}
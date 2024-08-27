import NotFound from '@/pages/NotFound'
import ErrorPage from '@/pages/ErrPage'
import Home from '@/pages/Home'
import AuthRouter from '@/pages/components/AuthRouter'
import Login from '@/pages/Login'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'


export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthRouter>
                <Home />
            </AuthRouter>
        ),
        errorElement: <ErrorPage />,
        children:[
            {
                path: '',
                element: <Navigate to="/home" />
            },
            {
                path: 'home',
            },
            {
                path: 'game',
                Component: lazy(() => import('@/pages/components/Game/Game')),
            },
            {
                path:"test",
                Component: lazy(() => import('@/pages/Test')),
            },
            {
                path: 'websocket-item',
                Component: lazy(() => import('@/pages/WebSocket')),
            },
            {
                path: 'chatroom',
                Component: lazy(() => import('@/pages/ChatRoom')),
            },
            {
                path: 'upload-file',
                Component: lazy(() => import('@/pages/Upload')),
            },
            {
                path: 'system',
                children:[
                    {
                        path: 'role',
                        Component: lazy(() => import('@/pages/System/Role')),
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        element:(
        <AuthRouter>
            <Login />
        </AuthRouter>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: '*',
        element: <NotFound />,
    }
])

export default function BaseRouter() {
    return (
        <RouterProvider router={router} />
    )
}

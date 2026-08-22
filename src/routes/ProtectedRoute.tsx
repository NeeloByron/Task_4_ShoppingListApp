import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/Redux/store'

export const ProtectedRoute = () => {
    const { user, token } = useAppSelector((state) => state.auth)

    if (!user || !token) {
        return <Navigate to='/login' replace />
    }
  return <Outlet />

}

export default ProtectedRoute

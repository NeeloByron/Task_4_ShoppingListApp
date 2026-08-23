import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/Redux/store'

export const PublicRoute = () => {
    const { user, token } = useAppSelector((state) => state.auth)

    if (user && token) {
      return <Navigate to='/dashboard' replace />  
    }
  return <Outlet />
}

export default PublicRoute
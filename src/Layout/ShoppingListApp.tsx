import { Register } from '@/Layout/Registration'
import { Login } from '@/Layout/Login'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/Redux/store'
import { logout } from '@/Redux/authslice'
import Home from '@/Layout/Home'

const DashboardPlaceholder = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }


return (
    <div className="p-8">
      <Home />
      <button
        onClick={handleLogout}
        className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Log out
      </button>
    </div>
  )
}

export const ShoppingListApp = () => {

  return (
    <>
     <Routes>
       <Route path='/' element={<Navigate to='/login' replace />} />
      {/*Public route*/}
      <Route element={<PublicRoute />}> 
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<DashboardPlaceholder />} />
      </Route>

      <Route path='/*' element={<Navigate to='login' replace />} />
     </Routes>
    </>
  )
}

export default ShoppingListApp

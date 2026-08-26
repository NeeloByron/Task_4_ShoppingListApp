import { Register } from '@/Layout/Registration'
import { Login } from '@/Layout/Login'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import { Route, Routes, Navigate} from 'react-router-dom'
import Home from '@/Layout/Home'
import { Profile } from '@/Layout/Profile'


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
         <Route path='/dashboard' element={<Home />} />
         <Route path='/profile' element={<Profile />} />
      </Route>

      <Route path='/*' element={<Navigate to='/login' replace />} />
     </Routes>
    </>
  )
}

export default ShoppingListApp

import { Register } from '@/Layout/Registration'
import { Login } from '@/Layout/Login'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import { Route, Routes, Navigate} from 'react-router-dom'
import Home from '@/Layout/Home'
import { Profile } from '@/Layout/Profile'
import { SharedList } from '@/Layout/sharedList'
import { Toaster } from '@/components/ui/toast'


export const ShoppingListApp = () => {

  return (
    <>
    <Toaster />
     <Routes>
       <Route path='/' element={<Navigate to='/login' replace />} />

      <Route path='/shared/:id' element={<SharedList />} />
      {/* Public route */}
      <Route element={<PublicRoute />}> 
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
      
      {/* Private route */}
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

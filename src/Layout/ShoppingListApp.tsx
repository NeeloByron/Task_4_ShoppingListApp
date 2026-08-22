import { Register } from '@/Layout/Registration'
import { Login } from '@/Layout/Login'
import { Route, Routes, Navigate } from 'react-router-dom'

const DashboardPlaceholder = () => <div className='p-8'>dashboard coming soon</div>

export const ShoppingListApp = () => {

  return (
    <>
     <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<DashboardPlaceholder />} />
      <Route path='/*' element={<Navigate to='login' />} />
     </Routes>
    </>
  )
}

export default ShoppingListApp

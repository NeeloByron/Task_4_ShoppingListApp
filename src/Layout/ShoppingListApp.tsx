import { Register } from '@/Layout/Registration'
import { Login } from '@/Layout/Login'
import { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'


export const ShoppingListApp = () => {

  return (
    <>
     <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
     </Routes>
    </>
  )
}

export default ShoppingListApp

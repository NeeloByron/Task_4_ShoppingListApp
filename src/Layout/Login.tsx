import React from 'react'
import { useForm } from 'react-hook-form'

export const Login = () => {
  return (
   <>
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        {/*create user side*/}
        <div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-bold tracking-tight'>Welcome back</h1>
             <p className='text-sm text-gray-500'>Sign In</p>

             <form  className='space-y-4'>

             </form>

          </div>
       </div>
     </div>
   </>
  )
}

export default Login

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export const Login = () => {
  const form = useForm<{ email: string }>()
  const loading = false

  return (
   <>
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        {/*create user side*/}
        <div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-bold tracking-tight'>Welcome back</h1>
             <p className='text-sm text-gray-500'>Login in your lists</p>
             </div>

             <form  className='space-y-4'>
               <label className='block space-y-2'>
                 <span className='text-sm font-medium'>Email Address</span>
                 <Input type='email' placeholder='name@email.com' className='rounded-md' {...form.register('email')} disabled={loading} />
                 <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
              </label>
              
               <label className='block space-y-2'>
                 <span className='text-sm font-medium'>Password</span>
                 <Input type='password' placeholder='Enter password' className='rounded-md' {...form.register('password')} disabled={loading}/>
                 <span className='text-sm text-red-500'>{form.formState.errors.password?.message}</span>
               </label>
                
                <p className='text-end text-sm text-gray-600'>
                  <a href='/login' className='font-medium text-blue-600 hover:underline'>   Forgot password?</a>
                </p>

               <Button type='submit' className='w-full rounded-md' disabled={loading}>Login</Button>

             </form>
             
             <p className='text-center text-sm text-gray-600'>No account?
               <a href='/login' className='font-medium text-blue-600 hover:underline'>   Create an account</a>      
             </p>
       </div>
     </div>
   </>
  )
}

export default Login

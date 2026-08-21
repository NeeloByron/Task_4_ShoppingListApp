import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserIcon } from "@animateicons/react/lucide";
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import { loginUser } from '@/Redux/authThunks'
import { useEffect, useRef, useState } from 'react'

// Zod schema login validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitAttempted, setSubmitAttemped] = useState(false)

  //Redux store 
  const { loading, error, user, token } = useAppSelector((state) => state.auth)
  const errorClearedRef = useRef(false)

  const form = useForm<LoginFormData>({
    resolver: async (values) => {
      const result = loginSchema.safeParse(values)

      if (result.success) {
        return{ values: result.data, errors: {} }
      }

      const errors = result.error.issues.reduce<Record<string, { type: string; message: string }>> (
        (accumulator, issue) => {
          const field = issue.path[0]
          if (typeof field === "string" && !accumulator[field]) {
            accumulator[field] = { type: issue.code, message: issue.message}
          }
          return accumulator
        },
        {},
      )
 
      return { values: {}, errors }
    },
     defaultValues: {
      email: "",
      password: ""
     },
  })
   
  //clear errors when typing 
  useEffect(() => {
    if (error && form.formState.isDirty && !errorClearedRef.current) {
      errorClearedRef.current = true
      console.log('Error cleared due to user input')
    }
  }, [form.formState.isDirty, error])

  //Reset error flag when new error appears
    useEffect(() => {
      if(error) {
        errorClearedRef.current = false
      }
    }, [error])

    //Navigate on successful login
    useEffect(() => {
      if (user && token) {
        console.log('Login successful')
      }
    }, [user, token, navigate])

    async function  onSubmit(values: LoginFormData) {
      setSubmitAttemped(true)
      try {
        const loginData = {
          email: values.email,
          password: values.password,
        }

        console.log('Submitting login data:', { email: loginData.email})
        await dispatch(loginUser(loginData)).unwrap()
        console.log('login dispatched succesfully')

      } catch (err: any) {
        console.error('login failed - Full error object:', err)
        console.log('Error Message:', err?.message)

        let errorMessage = 'Login failed. Please try again.'

        const errorMsg = err?.message || String(err) || '';
        const lowerMsg = errorMsg.toLowerCase();

        if (lowerMsg.includes('invalid email') ||
            lowerMsg.includes('invalid password') ||
            lowerMsg.includes('invalid credentials')) {
              errorMessage = 'Invalid email or password. Please try again.'
              console.log('Set invalid credentials message')
            }
            else if (lowerMsg.includes('network') ||
                     lowerMsg.includes('fetch') ||
                     lowerMsg.includes('connection') ||
                     lowerMsg.includes('failed to fetch')) {
                     errorMessage = 'Cannot connect to server. Make sure json-server is running on port 5000'
                     console.log('Set network error message')
                     }
                     else if (errorMsg) {
                      errorMessage = errorMsg 
                      console.log('Using error as is')
                     }
            }
          }

  return (
   <>
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        {/*create user side*/}
        <div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <UserIcon size={50} color="#000000" duration={1} />
            <h1 className='text-2xl font-bold tracking-tight'>Welcome back</h1>
             <p className='text-sm text-gray-500'>Login in your lists</p>
             </div>

             {/*Redux error */}
             {error && (<div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>{error}</div>)}
             {form.formState.errors.root && (<div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>{form.formState.errors.root.message}</div>)}

             {/* connection error if submit attempted and still loading */}
             {submitAttempted && loading && (<div className='rounded-md bg-blue-50 p-3 text-sm text-blue-600 border border-blue-200'>Attempting to connect to server...</div>)}
            
             <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
               <label className='block space-y-2'>
                 <span className='text-sm font-medium'>Email Address</span>
                 <Input type='email' placeholder='name@email.com' autoComplete='email' className='rounded-md' {...form.register('email')} disabled={loading} />
                 <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
              </label>
              
               <label className='block space-y-2'>
                 <span className='text-sm font-medium'>Password</span>
                 <Input type='password' placeholder='Enter password' className='rounded-md' {...form.register('password')} disabled={loading}/>
                 <span className='text-sm text-red-500'>{form.formState.errors.password?.message}</span>
               </label>
                
                <p className='text-end text-sm text-gray-600'>
                  <Link to='/forgot-password' className='font-medium text-blue-600 hover:underline'>   Forgot password?</Link>
                </p>

               <Button type='submit' className='w-full rounded-md' disabled={loading}>{loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />Logging in...
                   </span>
                     ) : ( 
                    'Login'
                    )}
                </Button>
               </form>
             
             <p className='text-center text-sm text-gray-600'>No account?
               <Link to='/register' className='font-medium text-blue-600 hover:underline'>   Create an account</Link>      
             </p>
       </div>
     </div>
   </>
  )
}

export default Login

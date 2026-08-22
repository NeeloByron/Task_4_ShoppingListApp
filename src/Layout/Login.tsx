import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { UserIcon } from "@animateicons/react/lucide";
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import { loginUser } from '@/Redux/authThunks'
import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Zod schema login validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          setShowSuccess(true)
          const timer = setTimeout(() => {
            navigate('/dashboard')
        }, 1500)
         return () => {
          clearTimeout(timer)
         }
        }
        }, [user, token, navigate])

    async function  onSubmit(values: LoginFormData) {
      setSubmitAttempted(true)
      setShowSuccess(false)
      try {
        const loginData = {
          email: values.email,
          password: values.password,
        }

        await dispatch(loginUser(loginData)).unwrap()

      } catch (err: any) {
        let errorMessage = 'Login failed. Please try again.'

        const errorMsg = err?.message || String(err) || '';
        const lowerMsg = errorMsg.toLowerCase();

        if (lowerMsg.includes('invalid email') ||
            lowerMsg.includes('invalid password') ||
            lowerMsg.includes('invalid credentials')) {
              errorMessage = 'Invalid email or password. Please try again.'
            }
            else if (lowerMsg.includes('network') ||
                     lowerMsg.includes('fetch') ||
                     lowerMsg.includes('connection') ||
                     lowerMsg.includes('failed to fetch')) {
                     errorMessage = 'Cannot connect to server. Make sure json-server is running on port 5000'
                     }
                     else if (errorMsg) {
                      errorMessage = errorMsg 
                      console.log('Using error as is')
                     }
                form.setError('root', { message: errorMessage })
            }
          }

  return (
   <>
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        {/*create user side*/}
        <div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <UserIcon size={50} color="#000000" duration={1} />
            <h1 className='text-2xl font-bold tracking-tight'>Login</h1>
             <p className='text-sm text-gray-500'>Login to your list</p>
             </div>

              {/*Success message notification*/}
             {showSuccess && (
             <div role='alert' className='rounded-md border border-green-500 bg-green-50 p-4 shadow-sm'>
               <div className='flex items-start gap-4'>
                 <svg
                   aria-hidden='true'
                   xmlns='http://www.w3.org/2000/svg'
                   fill='none'
                   viewBox='0 0 24 24'
                   strokeWidth='1.5'
                   stroke='currentColor'
                   className='-mt-0.5 size-6 text-green-700'
                  >
                 <path
                   strokeLinecap='round'
                   strokeLinejoin='round'
                   d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>

                <div className='flex-1'>
                 <strong className='block leading-tight font-medium text-green-800'>Login succesful!</strong>
                <span className='block text-xs text-green-500 mt-0.5'>Redirecting to dashboard...</span>
               </div>
              </div>
             </div>
         )}

             {/*Redux error */}
             {error && !showSuccess && (<div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>{error}</div>)}
             {form.formState.errors.root && !showSuccess && (<div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>{form.formState.errors.root.message}</div>)}

             {/* connection error if submit attempted and still loading */}
             {submitAttempted && loading && !showSuccess && (<div className='rounded-md bg-blue-50 p-3 text-sm text-blue-600 border border-blue-200'>Attempting to connect to server...</div>)}
            
             <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
               <label className='block space-y-2'>
                 <span className='text-sm font-medium'>Email Address</span>
                 <Input type='email' placeholder='name@email.com' autoComplete='email' className='rounded-md' {...form.register('email')} disabled={loading || showSuccess} />
                 <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
              </label>
              
               <label className='block space-y-2'>
                <span className='text-sm font-medium'>Password</span>
                 <div className='relative'>
                   <Input type={showPassword ? 'text' : 'password'} placeholder='Enter password' className='rounded-md pr-10' {...form.register('password')} disabled={loading || showSuccess}/>
                    <button
                     type='button'
                     onClick={() => setShowPassword((prev) => !prev)}
                     className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                     tabIndex={-1}
                    >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                  </div>
                 <span className='text-sm text-red-500'>{form.formState.errors.password?.message}</span>
               </label>
                
                <p className='text-end text-sm text-gray-600'>
                  <Link to='/forgot-password' className='font-medium text-blue-600 hover:underline'>   Forgot password?</Link>
                </p>

               <Button type='submit' className='w-full rounded-md' disabled={loading || showSuccess}>{loading ? (
                 <span className='flex items-center justify-center gap-2'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />Logging in...
                 </span>
                 ) : showSuccess ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                  Success!
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

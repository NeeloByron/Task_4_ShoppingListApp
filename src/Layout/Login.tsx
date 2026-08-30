import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import { loginUser } from '@/Redux/authThunks'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Eye, EyeOff, ShoppingCart } from 'lucide-react'
import { toast } from '@/components/ui/toast'

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
         toast.add({
          title: 'Login successfull',
          description: 'Redirecting to dashboard...',
          type: 'success',
         })
         const timer = setTimeout(() => {
          navigate('/dashboard')
         }, 3000)
          return () => {
            clearTimeout(timer)
          }
         }
        }, [user, token, navigate])

    async function onSubmit(values: LoginFormData) {
      setSubmitAttempted(true)
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
                     errorMessage = 'Service are not avaible'
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
    {/* page layout */}
    <div className='flex min-h-screen'>
      {/* left side of the form */}
      <div className='flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2'>          
        {/* shopping cart icon */}
        <div className='w-full max-w-sm space-y-6'>
          <div className='flex h-10 w-10 items-center justify-center rounded-[10px] bg-black'>
           <ShoppingCart size={22} className='text-white' />
             </div>
              
              {/* header */}
             <div className='space-y-1'>
               <h1 className='text-[26px] font-medium tracking-tight text-gray-900'>Welcome back</h1>
               <p className='text-sm text-gray-500'>Log in to manage your shopping lists.</p>
             </div>
              
              {/* connection error if submit attempted and still loading */}
             {form.formState.errors.root && (
              <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
                {form.formState.errors.root.message}</div>)}

             {/* login form */}
             <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
               <label className='block space-y-2'>
                 <span className='text-sm font-medium'>Email Address</span>
                 <Input type='email' placeholder='name@email.com' autoComplete='email' className='rounded-md' {...form.register('email')} disabled={loading} />
                 <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
              </label>
              
               <label className='block space-y-2'>
                <span className='text-sm font-medium'>Password</span>
                 <div className='relative'>
                   <Input type={showPassword ? 'text' : 'password'} placeholder='Enter password' className='rounded-md pr-10' {...form.register('password')} disabled={loading}/>
                    <button
                     type='button'
                     onClick={() => setShowPassword((prev) => !prev)}
                     className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                     tabIndex={-1}>
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                  </div>
                 <span className='text-sm text-red-500'>{form.formState.errors.password?.message}</span>
               </label>

               {/* remember me checkbox */}
               <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2 text-gray-600'>
                  <input type='checkbox'
                         className='h-3.5 w-3.5 rounded border-gray-300' />
                         Remember me
                </label>
               {/* <Link to='/forgot-password' className='text-gray-900 underline hover:text-gray-600'>Forgot password?</Link> */}
               </div>

               <Button type='submit' className='w-full rounded-[10px] bg-black hover:bg-gray-800' disabled={loading}>{loading ? (
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

        {/* Right side of the form  illustration panel*/}
        <div className='relative hidden overflow-hidden bg-[#0A0A0A] lg:block lg:w-1/2'>
         <svg width='100%' height='100%' viewBox='0 0 400 480' className='absolute inset-0' preserveAspectRatio='xMidYMid slice'>
          <rect x='0' y='0' width='400' height='480' fill='#0A0A0A' />
          <circle cx='80' cy='90' r='70' fill='#FFFFFF' opacity='0.06' />
          <circle cx='320' cy='60' r='40' fill='#FFFFFF' opacity='0.08' />
          <polygon points='200,130 240,190 160,190' fill='#FFFFFF' opacity='0.9' />
          <polygon points='200,170 240,230 160,230' fill='#FFFFFF' opacity='0.35' />
          <rect x='60' y='260' width='90' height='90' fill='none' stroke='#FFFFFF' strokeWidth='1' opacity='0.5' transform='rotate(15 105 305)' />
          <circle cx='300' cy='300' r='28' fill='none' stroke='#FFFFFF' strokeWidth='1' opacity='0.6' />
          <circle cx='300' cy='300' r='14' fill='#FFFFFF' opacity='0.9' />
          <path d='M330 350 L334 362 L346 366 L334 370 L330 382 L326 370 L314 366 L326 362 Z' fill='#FFFFFF' opacity='0.85' />
          <circle cx='90' cy='420' r='3' fill='#FFFFFF' opacity='0.5' />
          <circle cx='110' cy='440' r='2' fill='#FFFFFF' opacity='0.4' />
          <circle cx='70' cy='440' r='2' fill='#FFFFFF' opacity='0.4' />
        </svg>
        </div>
      </div>
   </>
  )
}

export default Login

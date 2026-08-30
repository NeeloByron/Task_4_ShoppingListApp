import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector} from "@/Redux/store"
import { registerUser } from '@/Redux/authThunks'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShoppingCart, CheckCircle2, ListSortAscendingIcon } from 'lucide-react'
import axiosInstance from '@/api/axiosConfig'
import { toast } from '@/components/ui/toast'

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  cellNumber: z.string().regex(/^\d+$/,"Cell number must contain only digits").min(10, "Cell number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

type RegisterFormData = z.infer<typeof registerSchema>

export const Register = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitAttemped, setSubmitAttempted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  //Redux store
  const { loading, error, user, token} = useAppSelector((state) => state.auth)
  
  //Ref to track if error has closed 
  const errorClearedRef = useRef(false)

  const form = useForm<RegisterFormData>({
    resolver: async (values) => {
      const result = registerSchema.safeParse(values)

      if (result.success) {
        return { values: result.data, errors: {} }
      }

      const errors = result.error.issues.reduce<Record<string, { type: string; message: string }>>(
        (accumulator, issue) => {
          const field = issue.path[0]
          if (typeof field === "string" && !accumulator[field]) {
            accumulator[field] = { type: issue.code, message: issue.message }
          }
          return accumulator
        },
        {},
      )

      return { values: {}, errors }
    },
    defaultValues: { name: "", surname: "", email: "", cellNumber: "", password: "", confirmPassword: "" },
  })

//email must contain characters numbers and and 1 uppercase character
const [checkingEmail, setCheckingEmail] = useState(false)
const emailCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

const emailValue = form.watch('email')

useEffect(() => {
  if (emailCheckTimer.current) {
    clearTimeout(emailCheckTimer.current)
  }

  const parsed = z.string().email().safeParse(emailValue)
  if (!parsed.success) {
    return
  }

 emailCheckTimer.current = setTimeout(async () => {
  setCheckingEmail(true) 
  try {
     const response = await axiosInstance.get('/users')
     const exists = response.data.some (
      (u: any) => u.email.toLowerCase() === emailValue.toLowerCase()
     )
     if (exists) {
     form.setError('email', {type: 'manual', message: 'This email is already registered'})
     } else if (form.formState.errors.email?.type === 'manual') {
      form.clearErrors('email')
     }
    } catch {
      
    } finally {
      setCheckingEmail(false)
    }
  }, 600)

  return () => {
    if (emailCheckTimer.current) {
      clearTimeout(emailCheckTimer.current)
    }
  }
}, [emailValue])

  //clear redux errors when users type
  useEffect(() => {
  if (error && form.formState.isDirty && !errorClearedRef.current) {
    errorClearedRef.current = true
    console.log('Error cleared due to user input')
   }
  }, [form.formState.isDirty, error, dispatch])

  //reset error
  useEffect(() => {
    if (error) {
      errorClearedRef.current = false
    }
  }, [error])

  //success message then navigate 
  useEffect(() => {
    if (user && token) {
      toast.add({
        title: 'Account created',
        description: 'Redirecting to your dashboard...',
        type: 'success'
      })
      
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [user, token, navigate])

  async function onSubmit(values: RegisterFormData) {
    setSubmitAttempted(true)
    setShowSuccess(false)
    try {
      // Match the RegisterData shape expected by the thunk.
      const registerData = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        cellNumber: Number(values.cellNumber),
        password: values.password,
      }

      //dispatch authThunk
       await dispatch(registerUser(registerData)).unwrap()
       //Error from fetching data
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.'
      
      const errorMsg = err?.message || String(err) || '';
      const lowerMsg = errorMsg.toLowerCase();

      if (lowerMsg.includes('already exists') || 
            lowerMsg.includes('already exist') ||
            lowerMsg.includes('user with this email') ||
            errorMsg.includes('email already')) {
            errorMessage = 'This email is already registered. Please use a different email or log in.'
        } 
        else if (lowerMsg.includes('network') || 
                 lowerMsg.includes('fetch') || 
                 lowerMsg.includes('connection') ||
                 lowerMsg.includes('failed to fetch')) {
            errorMessage = 'Cannot connect to server. Make sure check to check services'
        } 
        else if (errorMsg) {
            errorMessage = errorMsg
        }
      form.setError('root', { message: errorMessage })
    }
  }

  return (
    <>
     {/* page layout */}
     <div className='flex min-h-screen'>
      {/* left side of the form create user */}
       <div className='flex min-h-screen items-center justify-center bg-white p-6 py-12 lg:w-1/2'>
        <div className='w-full max-w-sm space-y-5'>
          <div className='flex h-10 w-10 items-center justify-center rounded-[10px] bg-black'>
            <ShoppingCart size={22} className='text-white' />
          </div>

           {/* header */}
           <div className='space-y-1'>
            <h1 className='text-2xl font-medium tracking-tight text-gray-900'>Create an account</h1>
            <p className='text-sm text-gray-500'>Start organizing your shopping</p>
           </div>

        {/* Display form root error */}
        {form.formState.errors.root && !showSuccess && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
            {form.formState.errors.root.message}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
             <div className='flex gap-3'>
             <label className='block flex-1 space-y-2'>
                <span className='text-sm font-medium text-gray-900'>Name</span>
                <Input placeholder='First Name' className='rounded-[10px]'{...form.register('name')} disabled={loading} />
                <span className='text-sm text-red-500'>{form.formState.errors.name?.message}</span>
              </label>
              
             <label className='block flex-1 space-y-2'>
                <span className='text-sm font-medium text-gray-900'>Surname</span>
                <Input placeholder='Last Name' className='rounded-[10px]' {...form.register('surname')} disabled={loading} />
                <span className='text-sm text-red-500'>{form.formState.errors.surname?.message}</span>
              </label>
              </div>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-gray-900'>Email Address</span>
              <Input type='email' placeholder='name@email.com' className='rounded-[10px]' {...form.register('email')} disabled={loading} />
              {checkingEmail && <span className='text-xs text-gray-400'>Checking availability...</span>}
              <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-gray-900'>Cell Number</span>
              <Input type='tel' inputMode='numeric' maxLength={15} placeholder='082 123 4567' className='rounded-[10px]' {...form.register('cellNumber')} disabled={loading} />
              <span className="text-sm text-red-500">{form.formState.errors.cellNumber?.message}</span>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-gray-900'>Password</span>
              <div className='relative'>
                <Input type={showPassword ? 'text' : 'password'} placeholder='Create a password' className='rounded-md pr-10' {...form.register('password')} disabled={loading}/>
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

            <label className='block space-y-2'>
             <span className='text-sm font-medium text-gray-900'>Confirm Password</span>
               <div className='relative'>
                 <Input type={showConfirmPassword ? 'text' : 'password'} placeholder='Re-enter password' className='rounded-[10px] pr-10' {...form.register('confirmPassword')} disabled={loading || showSuccess}/>
                 <button
                   type='button'
                   onClick={() => setShowConfirmPassword((prev) => !prev)}
                   className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                   tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
               </div>
              <span className='text-sm text-red-500'>{form.formState.errors.confirmPassword?.message}</span>
            </label>

            <Button type='submit' className='w-full rounded-[10px] bg-black hover:bg-gray-800' disabled={loading}>
             {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Creating account...
              </span>
             ) : showSuccess ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Success!
              </span>
              ) : (
              'Create account'
            )}
            </Button>
        </form>

         <p className='text-center text-sm text-gray-600'>Already have an account?
            <Link to='/login' className='font-medium text-gray-900 hover:underline'>   Log in</Link>      
         </p>
      </div>
      </div>
      
      {/* Right side illustration */}
      <div className='relative hidden overflow-hidden bg-[#0A0A0A] lg:block lg:w-1/2'>
       <svg width='100%' height='100%' viewBox='0 0 400 560' className='absolute inset-0' preserveAspectRatio='xMidYMid slice'>
          <rect x='0' y='0' width='400' height='560' fill='#0A0A0A' />
          <circle cx='70' cy='100' r='65' fill='#FFFFFF' opacity='0.06' />
          <circle cx='330' cy='70' r='36' fill='#FFFFFF' opacity='0.08' />
          <rect x='160' y='150' width='80' height='80' rx='8' fill='none' stroke='#FFFFFF' strokeWidth='1' opacity='0.55' transform='rotate(20 200 190)' />
          <circle cx='200' cy='190' r='10' fill='#FFFFFF' opacity='0.9' />
          <polygon points='90,290 130,350 50,350' fill='#FFFFFF' opacity='0.85' />
          <polygon points='330,300 362,352 298,352' fill='#FFFFFF' opacity='0.3' />
          <circle cx='300' cy='420' r='26' fill='none' stroke='#FFFFFF' strokeWidth='1' opacity='0.6' />
          <circle cx='300' cy='420' r='12' fill='#FFFFFF' opacity='0.9' />
          <path d='M110 470 L114 482 L126 486 L114 490 L110 502 L106 490 L94 486 L106 482 Z' fill='#FFFFFF' opacity='0.85' />
          <circle cx='250' cy='510' r='3' fill='#FFFFFF' opacity='0.5' />
          <circle cx='270' cy='530' r='2' fill='#FFFFFF' opacity='0.4' />
          <circle cx='230' cy='530' r='2' fill='#FFFFFF' opacity='0.4' />
        </svg>
       </div>
     
    </div>
    </>
  )
}

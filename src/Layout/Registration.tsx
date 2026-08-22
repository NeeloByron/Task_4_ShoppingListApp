import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector} from "@/Redux/store"
import { registerUser } from '@/Redux/authThunks'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'


const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  cellNumber: z.string().min(10, "Cell number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
      console.log('Registration successful!')
      setShowSuccess(true)
      
      console.log('Registration successful!')
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 3000)

      return () => {
        clearTimeout(timer)
        console.log('Timer cleared')
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
       
      console.log('Submitting registration data:', registerData)
      //dispatch authThunk
       await dispatch(registerUser(registerData)).unwrap()
       console.log('Registration dispatched successfully')

    } catch (err: any) {
      console.error('Registration failed - Full error object:', err)
      console.error('Error Message:', err?.message)

      let errorMessage = 'Registration failed. Please try again.'
      
      const errorMsg = err?.message || String(err) || '';
      const lowerMsg = errorMsg.toLowerCase();

      if (lowerMsg.includes('already exists') || 
            lowerMsg.includes('already exist') ||
            lowerMsg.includes('user with this email') ||
            errorMsg.includes('email already')) {
            errorMessage = 'This email is already registered. Please use a different email or log in.'
            console.log('Set "already exists" message')
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
            console.log('Using error message as is')
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
            <h1 className='text-2xl font-bold tracking-tight'>Create an account</h1>
            <p className='text-sm text-gray-500'>Start organizing your shopping</p>
          </div>
           
           {/*success notification */}
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
             <strong className='block leading-tight font-medium text-green-800'>Account created successfully!</strong>
             <span className='block text-xs text-green-500 mt-0.5'>Redirecting to dashboard...</span>
            </div>
           </div>
         </div>
       )}

           {/* Redux error*/}
          {error && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
            {error}
          </div>
        )}

        {/* Display form root error */}
        {form.formState.errors.root && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
            {form.formState.errors.root.message}
          </div>
        )}

        {/* loading indicator */}
        {submitAttemped && loading && !showSuccess && (
        <div className="inline-flex items-center gap-3" role="status">
          <svg
            className="size-6 animate-spin text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
           ></circle>

            <path
           className="opacity-75"
           fill="currentColor"
           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
           ></path>
          </svg>
         <p className="font-medium text-gray-700">Creating your account...</p>
       </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
             <label className='block space-y-2'>
                <span className='text-sm font-medium'>Name</span>
                <Input placeholder='First Name' className='rounded-md'{...form.register('name')} disabled={loading || showSuccess} />
                <span className='text-sm text-red-500'>{form.formState.errors.name?.message}</span>
              </label>
              
             <label className='block space-y-2'>
                <span className='text-sm font-medium'>Surname</span>
                <Input placeholder='Last Name' className='rounded-md' {...form.register('surname')} disabled={loading || showSuccess} />
                <span className='text-sm text-red-500'>{form.formState.errors.surname?.message}</span>
              </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium'>Email Address</span>
              <Input type='email' placeholder='name@email.com' className='rounded-md' {...form.register('email')} disabled={loading || showSuccess} />
              <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium'>Cell Number</span>
              <Input type='tel' placeholder='082 123 4567' className='rounded-md' {...form.register('cellNumber')} disabled={loading || showSuccess} />
              <span className="text-sm text-red-500">{form.formState.errors.cellNumber?.message}</span>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium'>Password</span>
              <div className='relative'>
                <Input type={showPassword ? 'text' : 'password'} placeholder='Create a password' className='rounded-md pr-10' {...form.register('password')} disabled={loading || showSuccess}/>
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
             <span className='text-sm font-medium'>Confirm Password</span>
               <div className='relative'>
                 <Input type={showConfirmPassword ? 'text' : 'password'} placeholder='Re-enter password' className='rounded-md pr-10' {...form.register('confirmPassword')} disabled={loading || showSuccess}/>
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

            <Button type='submit' className='w-full rounded-md' disabled={loading || showSuccess}>
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
            <Link to='/login' className='font-medium text-blue-600 hover:underline'>   Log in</Link>      
         </p>
      </div>

       {/*<div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>

       </div>*/}
    </div>
    </>
  )
}

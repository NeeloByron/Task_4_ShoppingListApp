import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector} from "@/Redux/store"
import { registerUser } from '@/Redux/authThunks'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import authReducer from '@/Redux/authslice'



const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  cellNumber: z.string().min(10, "Cell number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const Register = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
    defaultValues: { name: "", surname: "", email: "", cellNumber: "", password: "" },
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

  //registration successfull
  useEffect(() => {
    if (user && token) {
      console.log('Registration successful, navigating to home page')
      navigate('/dashboard')
    }
  }, [user, token, navigate])

   //clear error 
  useEffect(() => {
    return () => {
    console.log('Component unmounting')
    }
  }, [dispatch])

  async function onSubmit(values: RegisterFormData) {
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

       console.log('Registration dispatched successfully')

    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <>
       <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        {/*create user side*/}
        <div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-bold tracking-tight'>Create an account</h1>
            <p className='text-sm text-gray-500'>Enter your details to register</p>
          </div>

          {error && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
             <label className='block space-y-2'>
                <span className='text-sm font-medium'>Name</span>
                <Input placeholder='Name' className='rounded-md'{...form.register('name')} disabled={loading} />
                <span className='text-sm text-red-500'>{form.formState.errors.name?.message}</span>
              </label>
              
             <label className='block space-y-2'>
                <span className='text-sm font-medium'>Surname</span>
                <Input placeholder='Surname' className='rounded-md' {...form.register('surname')} disabled={loading} />
                <span className='text-sm text-red-500'>{form.formState.errors.surname?.message}</span>
              </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium'>Email Address</span>
              <Input type='email' placeholder='name@example.com' className='rounded-md' {...form.register('email')} disabled={loading} />
              <span className='text-sm text-red-500'>{form.formState.errors.email?.message}</span>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium'>Cell Number</span>
              <Input type='tel' placeholder='0821234567' className='rounded-md' {...form.register('cellNumber')} disabled={loading} />
              <span className="text-sm text-red-500">{form.formState.errors.cellNumber?.message}</span>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium'>Password</span>
              <Input type='password' placeholder='••••••••' className='rounded-md' {...form.register('password')} disabled={loading}/>
              <span className='text-sm text-red-500'>{form.formState.errors.password?.message}</span>
            </label>

            <Button type='submit' className='w-full rounded-md' disabled={loading}>Sign Up</Button>
        </form>

         <p className='text-center text-sm text-gray-600'>Already have an account?
            <a href='/login' className='font-medium text-blue-600 hover:underline'>   Sign in</a>      
         </p>
      </div>

       {/*<div className='w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm'>

       </div>*/}
    </div>
    </>
  )
}

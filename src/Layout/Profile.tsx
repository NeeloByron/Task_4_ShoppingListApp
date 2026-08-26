import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import { updateProfile,changePassword } from '@/Redux/authThunks'
import { useState } from 'react'
import { NavBar } from '@/Layout/NavBar'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be atleast 2 characters'),
    surname: z.string().min(2, 'Surname must be atleast 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    cellNumber: z.string().regex(/^\d+$/, 'Cell number must contain only digits').min(10, 'Cell number must be atleast 10 digits')
})

type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be atleast 8 characters')
      .regex(/[A-z]/, 'Must contain atleast one uppercase letter')
      .regex(/[a-z]/, 'Must contain atleast one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export const Profile = () => {
    const dispatch = useAppDispatch()
    const { user, loading } = useAppSelector((state) => state.auth)

    const [profileSuccess, setProfileSuccess] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            surname: user?.surname || '',
            email: user?.email || '',
            cellNumber: String(user?.cellNumber || ''),
        },
    })

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: ''},
    })

    const onProfileSubmit = async (values: ProfileFormData) => {
        setProfileSuccess(false)
        try {
           await dispatch(updateProfile(values)).unwrap()
           setPasswordSuccess(true)
           setTimeout(() => setPasswordSuccess(false), 3000) 
        } catch (err: any) {
            profileForm.setError('root', { message: err || 'Failed to update profile'})
        }
    }

    const onPasswordSubmit = async (values: PasswordFormData) => {
        setPasswordSuccess(false)
        try {
            await dispatch(changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            })).unwrap()
            setPasswordSuccess(true)
            passwordForm.reset()
            setTimeout(() => setPasswordSuccess(false), 3000)
        } catch (err: any) {
        }
    }
  return (
      <>
        <NavBar />
        <div className='mx-auto max-w-2xl space-y-8 px-4 py-8'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight'>Profile</h1>
                <p className='text-sm text-gray-500'>View and update your account details</p>
            </div>

            {/*Profile information and edit form */}
            <div className='rounded-xl border bg-white p-6 shadow-sm'>
                <h2 className='mb-4 font-semibold'>Personal information</h2>
              
              {/* Profile success message */}
             {profileSuccess && (
                <div role='alert' className='mb-4 flex items-center gap-2 rounded-md border-green-500 bg-green-50 p-3 text-sm text-green-800'>
                    <CheckCircle2 size={16} />
                    Profile updated
                    </div>
             )}   
             {/* Profile error message */}
             {profileForm.formState.errors.root && !profileSuccess && (
                <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border-red-200'>
                    {profileForm.formState.errors.root.message}
               </div>
             )}

             {/* Profile form */}
             <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                    <label className='block space-y-2'>
                        <span className='text-sm font-medium'>Name</span>
                        <Input className='rounded-md'{...profileForm.register('name')} disabled={loading} />
                        <span className='text-sm text-red-500'>{profileForm.formState.errors.name?.message}</span>
                    </label>

                    <label className='block space-y-2'>
                        <span className='text-sm font-medium'>Surname</span>
                        <Input className='rounded-md'{...profileForm.register('surname')} disabled={loading} />
                        <span className='text-sm text-red-500'>{profileForm.formState.errors.surname?.message}</span>
                    </label>

                     <label className='block space-y-2'>
                        <span className='text-sm font-medium'>Email address</span>
                        <Input className='rounded-md'{...profileForm.register('email')} disabled={loading} />
                        <span className='text-sm text-red-500'>{profileForm.formState.errors.email?.message}</span>
                    </label>

                    <label className='block space-y-2'>
                        <span className='text-sm font-medium'>Cell number</span>
                        <Input className='rounded-md'{...profileForm.register('cellNumber')} disabled={loading} />
                        <span className='text-sm text-red-500'>{profileForm.formState.errors.cellNumber?.message}</span>
                    </label>

                    <Button type='submit' disabled={loading}>
                        {loading ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
             </form>
            </div>

            {/* change password */}
            <div className='rounded-xl border bg-white p-6 shadow-sm'>
                <h2 className='mb-4 font-semibold'>Change password</h2>

                {passwordSuccess && (
                  <div role='alert' className='mb-4 flex items-center gap-2 rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-800'>
                    <CheckCircle2 size={16} />
                    Password updated
                  </div>
                )}
                {passwordForm.formState.errors.root && !passwordSuccess && (
                  <div className='mb-4 rounded-mb bg-red-50 p-3 text-sm text-red-600 border-red-200'>
                    {passwordForm.formState.errors.root.message}
                  </div>
                )}

                {/* change password form */}
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className='space-y-4'>
                   <label className='block space-y-2'>
                     <span className='text-sm font-medium'>Current password</span>
                     <div className='relative'>
                        <Input type={showCurrent ? 'text' : 'password'} className='rounded-md pr-10' {...passwordForm.register('currentPassword')} disabled={loading} />
                        <button type='button'
                                onClick={() => setShowCurrent((p) => !p)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-500'
                                tabIndex={-1}
                                aria-label={showCurrent ? 'Hide password' : 'Show password'}>
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                     <span className='text-sm text-red-500'>{passwordForm.formState.errors.newPassword?.message}</span>
                   </label> 

                   <label className='block space-y-2'>
                     <span className='text-sm font-medium'>Confirm new password</span>
                     <div className='relative'>
                        <Input type={showConfirm ? 'text' : 'password'} className='rounded-md pr-10' {...passwordForm.register('currentPassword')} disabled={loading} />
                        <button type='button'
                                onClick={() => setShowConfirm((p) => !p)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-500'
                                tabIndex={-1}
                                aria-label={showCurrent ? 'Hide password' : 'Show password'}>
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                     <span className='text-sm text-red-500'>{passwordForm.formState.errors.confirmPassword?.message}</span>
                   </label>

                   <Button type='submit' disabled={loading}>
                    {loading ? 'Updating...' : 'Update password'}
                   </Button>
                </form>
            </div>
        </div>
      </>
  )
}

export default Profile

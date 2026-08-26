import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import { updateProfile,changePassword } from '@/Redux/authThunks'
import { useState } from 'react'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be atleast 2 characters'),
    surname: z.string().min(2, 'Surname must be atleast 2 characters');
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
    const [showCurrent, setShowSuccess] = useState(false)
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

      </>
  )
}

export default Profile

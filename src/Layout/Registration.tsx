import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from "@/Redux/store"
import { registerUser } from '@/Redux/authThunks'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const { loading, error, user, token} = useAppDispatch((state) => state.auth)

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

  function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log("Form Submitted:", values)
  }

  return (
    <>
       <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-500">Enter your details to register</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-medium">Name</span>
                <Input placeholder="John" {...form.register("name")} />
                <span className="text-sm text-red-500">{form.formState.errors.name?.message}</span>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Surname</span>
                <Input placeholder="Doe" {...form.register("surname")} />
                <span className="text-sm text-red-500">{form.formState.errors.surname?.message}</span>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Email Address</span>
              <Input type="email" placeholder="name@example.com" {...form.register("email")} />
              <span className="text-sm text-red-500">{form.formState.errors.email?.message}</span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Cell Number</span>
              <Input type="tel" placeholder="0821234567" {...form.register("cellNumber")} />
              <span className="text-sm text-red-500">{form.formState.errors.cellNumber?.message}</span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Password</span>
              <Input type="password" placeholder="••••••••" {...form.register("password")} />
              <span className="text-sm text-red-500">{form.formState.errors.password?.message}</span>
            </label>

            <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </div>
    </div>
    </>
  )
}

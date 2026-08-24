import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' 
import { X, plus, Trash2, ImagePlus } from 'lucide-react'
import type { ShoppingList, ShoppingListInput } from '@/Redux/shoppingTypes'

const CATEGORIES = ['Groceries', 'Household', 'Events', 'Electronics', 'Other']

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  checked: z.boolean().default(false),
})

const listSchema = z.object({
  name: z.string().min(2, 'List name must be at least 2 characters'),
  category: z.string().min(1, 'Select a category'),
  notes: z.string().optional(),
  image: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Add at least one item'),
})

type ListFormData = z.infer<typeof listSchema>

type ShoppingListFormProps = {
  open: boolean
  onClose: () => void
  onSubmit: (data: ShoppingListInput) => void
  initialData?: ShoppingList | null
  loading?: boolean
}



export const shoppingListForm = ( { open, onClose, onSubmit, initialData, loading }: ShoppingListFormProps) => {
    const [imagePreview, setImagePreview] = useState<string>('')

    const form = useForm<ListFormData>({
     resolver: zodResolver(listSchema),
      defaultValues: {
      name: '',
      category: '',
      notes: '',
      image: '',
      items: [{ name: '', quantity: 1, checked: false }],
     },  
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    })

    useEffect(() => {
      if (initialData) {
      form.reset({
        name: initialData?.name,
        category: initialData?.category,
        notes: initialData?.notes || '',
        image: initialData?.image || '',
        items: initialData?.items.length
          ? initialData.items.map((i) => ({ name: i.name, quantity: i.quantity, checked: i.checked }))
          : [{ name: '', quantity: 1, checked: false }],
      })
      setImagePreview(initialData?.image || '')
    } else {
      form.reset({
        name: '',
        category: '',
        notes: '',
        image: '',
        items: [{ name: '', quantity: 1, checked: false }],
      })
      setImagePreview('')
     }
    }, [initialData, open])

    const handleFormSubmit = (values: ListFormData) => {
      onSubmit(values as ShoppingListInput)
    }

    if (!open) return null

  return (
         <>
         </>
  )
}

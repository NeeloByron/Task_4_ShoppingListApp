import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' 
import { X, Plus, Trash2, ImagePlus } from 'lucide-react'
import type { ShoppingList, ShoppingListInput } from '@/Redux/shoppingTypes'

const CATEGORIES = ['Groceries', 'Household', 'Events', 'Electronics', 'Other']

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  checked: z.boolean(),
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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onloadend = () => {
        const image = typeof reader.result === 'string' ? reader.result : ''
        setImagePreview(image)
        form.setValue('image', image)
      }
      reader.readAsDataURL(file)
    }

    const handleFormSubmit = (values: ListFormData) => {
      onSubmit(values as ShoppingListInput)
    }

    if (!open) return null

  return (
       <>
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5'>
         <div className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {initialData ? 'Edit list' : 'Create new list'}
            </h3>
            <button type='button'
                    onClick={onClose} aria-label='Close'><X size={20} className='text-gray-500 hover:text-gray-700' />
            </button>
              </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
              <label className='block space-y-2'>
                <span className='text-sm font-medium'>List name</span>
                <Input placeholder='Weekly groceries' className='rounded-md' {...form.register('name')} disabled={loading} />
                <span className='text-sm text-red-500'>{form.formState.errors.name?.message}</span>
              </label>

              <label className='block space-y-2'>
                <span className='text-sm font-medium'>Category</span>
                <select className='w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700'{...form.register('category')} disabled={loading}>
                  <option value=''>Select a category</option>
                   {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                   ))}
                </select>
                <span className='text-sm text-red-500'>{form.formState.errors.category?.message}</span>
              </label>

              <label className='block space-y-2'>
            <span className='text-sm font-medium'>Notes (optional)</span>
            <textarea
              className='w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700'
              rows={2}
              placeholder='Any extra details...'
              {...form.register('notes')}
              disabled={loading}
            />
          </label>

          <label className='block space-y-2'>
            <span className='text-sm font-medium'>Image (optional)</span>
            <div className='flex items-center gap-3'>
              {imagePreview ? (
                <img src={imagePreview} alt='List preview' className='h-16 w-16 rounded-md object-cover' />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-gray-300'>
                  <ImagePlus size={20} className='text-gray-400' />
                </div>
              )}
              <input type='file' accept='image/*' onChange={handleImageChange} disabled={loading} className='text-sm' />
            </div>
          </label>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Items</span>
              <button
                type='button'
                onClick={() => append({ name: '', quantity: 1, checked: false })}
                className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline'
              >
                <Plus size={14} />
                Add item
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className='flex items-start gap-2'>
                <div className='flex-1'>
                  <Input placeholder='Item name' className='rounded-md' {...form.register(`items.${index}.name`)} disabled={loading} />
                  <span className='text-xs text-red-500'>{form.formState.errors.items?.[index]?.name?.message}</span>
                </div>
                <div className='w-20'>
                  <Input type='number' min={1} placeholder='Qty' className='rounded-md' {...form.register(`items.${index}.quantity`)} disabled={loading} />
                </div>
                <button
                  type='button'
                  onClick={() => remove(index)}
                  disabled={loading || fields.length === 1}
                  aria-label='Remove item'
                  className='mt-2 text-gray-400 hover:text-red-500 disabled:opacity-30'
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {form.formState.errors.items?.root?.message && (
              <span className='text-sm text-red-500'>{form.formState.errors.items.root.message}</span>
            )}
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </button>
            <Button type='submit' disabled={loading}>
              {loading ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save changes' : 'Create list')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </>
  )
}

export default shoppingListForm
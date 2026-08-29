import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' 
import { X, Plus, Trash2, Loader2, Search } from 'lucide-react'
import type { ShoppingList, ShoppingListInput } from '@/Redux/shoppingTypes'
import {  useGetImagesQuery } from '@/api/imageApi'

//list categorie
const CATEGORIES = ['Groceries', 'Household', 'Events', 'Electronics', 'Other']

//types for image search
interface UnsplashImage {
  id: string
  urls: {
    small: string
    thumb: string
  }
  alt_description: string
}
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
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [triggerSearch, setTriggerSearch] = useState<string>('')
    const [showSearchGrid, setShowSearchGrid] = useState<boolean>(false)
    const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false)

    //RTK query
    const { data: searchData, isFetching: isSearching } = useGetImagesQuery(triggerSearch, {
      skip: !triggerSearch, 
    })

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
        //reset
       setSearchTerm('')
       setTriggerSearch('')
       setShowSearchGrid(false)
    }, [initialData, open])
     
    //image handler
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      
      setIsLocalLoading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const image = typeof reader.result === 'string' ? reader.result : ''
        setImagePreview(image)
        form.setValue('image', image)
        setIsLocalLoading(false)
      }

      reader.onerror = () => {
        setIsLocalLoading(false)
        console.error('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }

    //Trigger API call
    const handleWebSearch = (e: React.MouseEvent) => {
      e.preventDefault()
      if (searchTerm.trim()) {
        setTriggerSearch(searchTerm)
        setShowSearchGrid(true)
      }
    }

    // select image and press URL to react hook
    const handleSelectWebImage = (url: string) => {
      setImagePreview(url)
      form.setValue('image', url)
      setShowSearchGrid(false)
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

          <div className='block space-y-2'>
            <span className='text-sm font-medium'>List Cover Image (optional)</span>
            
            {/* Image view */}
            {imagePreview && (
             <div className='flex items-start gap-3'>  
              <img src={imagePreview} alt='selected cover' className='h-16 w-16 rounded-md object-cover' />
                <Button type='button'
                        onClick={() => {setImagePreview(''); form.setValue('image', '') }}
                        className='text-xs text-red-500 hover:underline'>
                        Remove
                   </Button>
                 </div>
                )}

                {/* Web Search Input Bar */}
                <div className="flex items-center gap-1">
                  <Input 
                    type="text" 
                    placeholder="Or Unsplash (e.g. fruit)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-xs" 
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleWebSearch(e as any)
                      }
                    }} />
                  <Button 
                    type="button" 
                    onClick={handleWebSearch} 
                    disabled={loading || !searchTerm.trim() || isSearching} 
                    className="h-8 px-2"
                    aria-label='search images'
                  >
                    {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  </Button>
               </div>
               </div>

            {/* Interactive Search Result Dropdown Grid */}
            {showSearchGrid && (
              <div className="mt-2 p-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto bg-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-500">Select a photo:</span>
                  <button type="button" onClick={() => setShowSearchGrid(false)} className="text-xs text-gray-400 hover:text-gray-600">hide</button>
                </div>

            {isSearching ? (
             <div className="flex justify-center py-4">
                <Loader2 size={20} className="animate-spin text-gray-400" />
               </div>
             ) : searchData?.results?.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
            {searchData.results.map((img: UnsplashImage) => (
              <button
                    key={img.id}
                    type="button"
                    onClick={() => handleSelectWebImage(img.urls.small)}
                    className="relative h-12 w-full rounded border overflow-hidden hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Select image: ${img.alt_description || 'Unsplash image'}`}>
              <img 
                  src={img.urls.thumb} 
                  alt={img.alt_description || 'Unsplash image'} 
                  className="h-full w-full object-cover"
                  loading="lazy"/>
            </button>
          ))}
              </div>
               ) : (
               <p className='py-2 text-xs text-gray-400 text-center'>
                No results for "{searchTerm}". Try another term.
              </p>
             )}
            </div>
          )}

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
            <Button type='submit' disabled={loading} className='min-w-25'>
              {loading ? (
                <>
                  <Loader2 size={16} className='animate-spin mr-2' />
                  {initialData ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Save changes' : 'Create list'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </>
  )
}

export default shoppingListForm
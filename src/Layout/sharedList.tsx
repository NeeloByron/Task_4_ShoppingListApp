import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { shoppingService } from '@/Service/ShoppingService'
import type { ShoppingList } from '@/Redux/shoppingTypes'
import { AlertCircle } from 'lucide-react'

const categoryStyles: Record<string, string> = {
    Groceries: 'bg-teal-50 text-teal-800',
    Household: 'bg-amber-50 text-amber-8000',
    Events: 'bg-pink-50 text-pink-800',
    Electronics: 'bg-blue-50 text-blue-800',
    Other: 'bg-gray-100 text-gray-700',
}

export const SharedList = () => {
    const { id } = useParams<{ id: string }>()
    const [list, setList] = useState<ShoppingList | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return
        setLoading(true) 
        shoppingService.fetchListById(id)
          .then(setList)
          .catch(() => setError('This list could not be found. It may have been deleted.'))
          .finally(() => setLoading(false))
    }, [id])

  return (
        <>
         <div className='min-h screen bg-gray-50 px-4 py-8'>
            <div className='mx-auto max-w-2xl'>
                <div className='mb-6 flex items-center justify-between'>
                    <Link to='/login' className='text-lg font-bold tracking-tight'>ShopList</Link>
                    <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'>Read-only view</span>
                </div>
                
                {/* loading */}
                {loading && <p className='text-sm text-gray-500'>Loading list....</p>}
                {/*error */}
                {error && !loading && (
                    <div className='flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600'>
                        <AlertCircle size={16} />
                        {error}
                        </div>
                  )}

                  {list && !loading && (
                 <div className='rounded-xl border bg-white p-6 shadow-sm'>
                  <div className='mb-1 flex items-start justify-between'>
                   <h1 className='text-xl font-bold'>{list.name}</h1>
                    <span className={`rounded-full px-2.5 py-1 text-xs ${categoryStyles[list.category] || 'bg-gray-100 text-gray-700'}`}>
                     {list.category}
                   </span>
                    </div>
                    {list.notes && <p className='mt-2 text-sm text-gray-600'>{list.notes}</p>}

                   <div className='mt-6 divide-y divide-gray-100'>
                   {list.items.map((item) => (
                   <div key={item.id} className='flex items-center gap-3 py-3'>
                   {item.image ? (
                    <img src={item.image} alt='' className='h-10 w-10 rounded-md object-cover' />
                   ) : (
                    <div className='h-10 w-10 rounded-md bg-gray-100' />
                  )}
                   <div className='flex-1'>
                    <p className={`text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                     </div>
                    <span className='text-sm text-gray-500'>x{item.quantity}</span>
                  </div>
                 ))}
                </div>

                <p className='mt-6 text-center text-xs text-gray-400'>
                Want your own lists? <Link to='/register' className='text-blue-600 hover:underline'>Create an account</Link>
                </p>
               </div>
                )}
            
            </div>
         </div>
        </>
  )
}

export default SharedList
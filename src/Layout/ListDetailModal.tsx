import { Pencil, X } from 'lucide-react'
import type { ShoppingList } from '@/Redux/shoppingTypes'

type ListDetailModalProps = {
    open: boolean
    list: ShoppingList | null
    onClose: () => void
    onEdit: (list: ShoppingList) => void
}

const categoryStyles: Record<string, string> = {
    Groceries: 'bg-teal-50 text-teal-800',
    Household: 'bg-amber-50 text-amber-800',
    Events: 'bg-pink-50 text-pink-800',
    Electronics: 'bg-blue-50 text-blue-800',
    Other: 'bg-gray-100 text-gray-700',
}

export const ListDetailModal = ({ open, list, onClose, onEdit }: ListDetailModalProps) => {
  if (!open || !list) return null

    return (
          <>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
             <div className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg'>
                <div className='mb-1 flex items-start justify-between'>
                    <h3 className='text-xl font-bold text-gray-900'>{list.name}</h3>
                    <button type='button'
                            onClick={onClose} aria-label='Close'>
                            <X size={20} className='text-gray-100 hover:text-gray-700' />
                    </button>
                </div>

            <span className={`inline-block rounded-full px-2.5 py-1 text-xs ${categoryStyles[list.category] || 'bg-gray-100 text-gray-700'}`}>
            {list.category}</span>

            {list.notes && (
            <p className='mt-3 text-sm text-gray-600'>{list.notes}</p>
            )}

            <div className='mt-6 divide-y divide-gray-100 border-t border-gray-100'>
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

           <div className='mt-6 flex justify-end gap-2'>
            <button
                    type='button'
                    onClick={onClose}
                    className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
              Close
          </button>
          <button
                  type='button'
                  onClick={() => onEdit(list)}
                  className='flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'>
            <Pencil size={14} />
              Edit list
          </button>
        </div>
       </div>
      </div>
    </>
  )
}

export default ListDetailModal

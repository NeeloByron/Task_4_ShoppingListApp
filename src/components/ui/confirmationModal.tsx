// Describe the values this component receives
type confirmationModalProps = {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
    loading?: boolean
}

export const confirmationModal = ({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel, loading }: confirmationModalProps) => { 
  // nothing will be shown when the modal is closed    
  if (!open) return null
  return (
       <>
         <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
            {/* display of confirmation popup */}
           <div className='w-full max-w-sm rounded-xl bg-white p-6 shadow-lg'>
             <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
              {/* Shows the explanation. */}
              <p className='mt-2 text-sm text-gray-600'>{description}</p>
                 {/* the two buttons next to each other. */}
               <div className='mt-6 flex justify-end gap-2'>
                <button 
                       type='button'
                       onClick={onCancel}
                       disabled={loading}
                       className='rounded-md border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-60'>
                        Cancel
               </button>
               <button 
                       type='button'
                       onClick={onConfirm}
                       disabled={loading}
                       className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60'>
                      {/* Change the text while deleting. */}
                     {loading ? 'Deleting...' : confirmLabel}
               </button>
             </div>
           </div>
         </div>
       </>
  )
}

export default confirmationModal

type EmptyStateProps = {
    title: string
    description: string 
    actionLabel?: string
    onAction?: () => void
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
        <>
          <div className='mx-auto max-w-md py-12 text-center'>
            <svg 
               aria-hidde='true'
               xmlns='http://www.w3.org/2000/svg'
               fill='none'
               viewBox='0 0 24 24'
               strokeWidth='1.5'
               stroke='currentColor'
               className='mx-auto size-20 text-gray-400'>
                <path
                     strokeLinecap='round'
                     strokeLinejoin='round' 
                     d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'/> 
               </svg>
               <h2 className='mt-2 text-[23px] font-medium tracking-tight text-gray-900'>{title}</h2>
               <p className='mt-2 text-sm text-gray-700'>{description}</p>
               {actionLabel && onAction && (
                <button
                      type='button'
                      onClick={onAction}
                      className='mt-6 block w-full rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800'>
                        {actionLabel}
                      </button>
                  )}
            </div>
        </>
    )
}

export default EmptyState
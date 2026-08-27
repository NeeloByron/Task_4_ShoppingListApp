import { useState } from 'react'
import { X, Copy, Check, Mail } from 'lucide-react'

type shareModalProps = {
    open: boolean
    listName: string
    shareUrl: string
    onClose: () => void
}

export const shareModal = ( {open, listName, shareUrl, onClose }: shareModalProps) => {
    const [copied, setcopied] = useState(false)

    if (!open) return null

    const handleCopy = async () => {
        try { 
            await navigator.clipboard.writeText(shareUrl)
            setcopied(true)
            setTimeout(() => setcopied(false), 2000)
        } catch {

        }
    }
      {/* email, whatsApp & twitter */}
    const emailHref = `mailto:?subject=${encodeURIComponent(`Shopping list: ${listName}`)}&body=${encodeURIComponent(`Check out my shopping list "${listName}": ${shareUrl}`)}`
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Check out my shopping list "${listName}": ${shareUrl}`)}`
    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my shopping list "${listName}"`)}&url=${encodeURIComponent(shareUrl)}`

  return (
        <>
         <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-sm rounded-xl bg-white p-6 shadow-lg'>

           <div className='mb-4 flex items-center justify-between'>
             <h3 className='text-lg font-semibold text-gray-900'>Share, "{listName}"</h3>
             <button type='button' onClick={onClose} aria-label='Close'>
                <X size={20} className='text-gray-500 hover:text-gray-700' />
              </button>
            </div>
    
           <div className='mb-4 flex items-center gap-2'>
             <input type='text' 
                    readOnly
                    value={shareUrl}
                    className='flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600' />
             <button type='button'
                     onClick={handleCopy}
                     className='flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50'>
                        {copied ? <Check size={16} className='text-green-600' /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
            </button>
           </div>

           <p className='mb-2 text-sm font-medium text-gray-700'>or Share via</p>
           <div className='flex gap-2'>
             <a
               href={emailHref}
               className='flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50'
             >
               <Mail size={16} />
               Email
             </a>
             <a
               href={whatsappHref}
               target='_blank'
               rel='noopener noreferrer'
               className='flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50'
             >
               WhatsApp
             </a>
             <a
               href={twitterHref}
               target='_blank'
               rel='noopener noreferrer'
               className='flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50'
             >
               X
             </a>
           </div>
          </div>
         </div>
        </>
  )
}

export default shareModal

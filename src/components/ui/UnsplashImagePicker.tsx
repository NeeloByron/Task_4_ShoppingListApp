import { useState } from 'react'
import { useGetImagesQuery } from '@/api/imageApi'
import { Input } from './input'
import { Button } from './button'

type Props = {
  label: string
  searchHint: string
  value: string
  disabled?: boolean
  onChange: (url: string) => void
}

export function UnsplashImagePicker({ label, searchHint, value, disabled, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('')
  const { currentData, isFetching, isError, refetch } = useGetImagesQuery(query, { skip: !open || !query })

  function search() {
    const next = term.trim()
    if (!next) return
    if (next === query) void refetch()
    else setQuery(next)
  }

  return (
    <div className='space-y-2'>
      <p className='text-sm font-medium'>{label}</p>
      {value && <img src={value} alt={label} className='h-16 w-16 rounded-md object-cover' />}
      <div className='flex gap-2'>
        <Button type='button' variant='outline' disabled={disabled} onClick={() => {
          const next = searchHint.trim()
          setTerm(next)
          setQuery(next)
          setOpen(true)
        }}>{value ? 'Change image' : 'Choose image'} from Unsplash</Button>
        {value && <Button type='button' variant='ghost' disabled={disabled} onClick={() => onChange('')}>Remove image</Button>}
      </div>
      {open && (
        <div className='space-y-2 rounded-md border bg-gray-50 p-3'>
          <div className='flex gap-2'>
            <Input aria-label={`Search Unsplash: ${label}`} placeholder='Search for an item, e.g. apples'
              value={term} disabled={disabled} onChange={(event) => setTerm(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); search() } }} />
            <Button type='button' disabled={disabled || !term.trim() || isFetching} onClick={search}>Search</Button>
            <Button type='button' variant='ghost' onClick={() => setOpen(false)}>Hide</Button>
          </div>
          {isFetching ? <p role='status' className='text-sm'>Searching Unsplash...</p>
            : isError ? <p role='alert' className='text-sm text-red-600'>Could not load images. Check your connection and try Search again.</p>
            : !query ? <p className='text-sm'>Enter an item name to find matching images.</p>
            : currentData?.results.length ? (
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                {currentData.results.map((photo) => (
                  <div key={photo.id}>
                    <button type='button' disabled={disabled} className='w-full overflow-hidden rounded-md border focus:ring-2 focus:ring-blue-500'
                      aria-label={`Select ${photo.alt_description || query}`} onClick={() => { onChange(photo.urls.small); setOpen(false) }}>
                      <img src={photo.urls.thumb} alt={photo.alt_description || query} loading='lazy' className='h-20 w-full object-cover' />
                    </button>
                    <a href={`${photo.user.links.html}?utm_source=shopping_list_app&utm_medium=referral`} target='_blank' rel='noreferrer' className='text-xs text-gray-600 underline'>{photo.user.name}</a>
                  </div>
                ))}
              </div>
            ) : <p className='text-sm'>No images found for “{query}”. Try another search.</p>}
          <a href='https://unsplash.com/?utm_source=shopping_list_app&utm_medium=referral' target='_blank' rel='noreferrer' className='text-xs text-gray-500 underline'>Photos from Unsplash</a>
        </div>
      )}
    </div>
  )
}

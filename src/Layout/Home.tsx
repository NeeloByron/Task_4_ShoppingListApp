import NavBar from '@/Layout/NavBar'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/Redux/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Share2, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { confirmationModal as ConfirmationModal } from '@/components/ui/confirmationModal'
import { fetchLists, addList, updatelist, deleteList } from '@/Redux/shoppingThunks'
import type { ShoppingListInput, ShoppingList } from '@/Redux/shoppingTypes'
import { shoppingListForm as ShoppingListForm } from '@/components/ui/shoppingListForm'


const categoryStyles: Record<string, string> = {
    Groceries: 'bg-teal-50 text-teal-800',
    Household: 'bg-teal-50 text-teal-800',
    Events: 'bg-teal-50 text-teal-800',
    Electronics: 'bg-teal-50 text-teal-800',
}

export const Home = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { lists, loading } = useAppSelector((state) => state.shopping)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('date')
  const [formOpen, setFormOpen] = useState(false)
  const [editingList, setEditingList] = useState<ShoppingList | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ShoppingList | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const filteredLists = [...lists]
    .filter((list) => list.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'category') return a.category.localeCompare(b.category)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const openAddForm = () => {
      setEditingList(null)
      setFormOpen(true)
    }

    const openEditForm = (list: ShoppingList) => {
      setEditingList(list)
      setFormOpen(true)
    }

    const handleFormSubmit = async (data: ShoppingListInput) => {
      try {
        if (editingList) {
          await dispatch(updatelist({ id: editingList.id, data})).unwrap()
          setSuccessMessage('List updated')
        } else {
          await dispatch(addList(data)).unwrap()
          setSuccessMessage('List created')
        }
      } catch {
        }
      }

      const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        try {
          await dispatch(deleteList(deleteTarget.id)).unwrap()
          setSuccessMessage('List deleted')
        } finally {
          setDeleteTarget(null)
        }
      }


  return (
    <>
      <NavBar />

      <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
       {/* success message */}
      {successMessage && (
        <div role='alert' className='flex items-center gap-2 rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-800'>
          <CheckCircle2 size={16} />
          {successMessage}
        </div>
      )}

       {/* Header */}
      <div className='flex items-center justify-between'>
         <p className='text-lg font-medium'>My lists</p>
          {/* <p className='text-sm text-gray-500'>{lists.length} lists</p> */}
          <Button onClick={openAddForm} className='flex items-center bg-black'>
            
            New list
          </Button>
      </div>

      {/* search & sort */}
      <div className='flex gap-2'>
       <div className='relative flex-1'>
         <Search size={20} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
         <Input type='text'
                placeholder='Search items'
                className='rounded-md pl-9'
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
       </div>
        <select value={sort}
                onChange={(e) => setSort(e.target.value)}
                className='w-40 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700'>
                 <option value='name'>Sort by: Name</option> 
                 <option value='category'>Sort by: Category</option>
                 <option value='date'>Sort by: Date added</option>
                </select>
      </div>
       
       {/* empty state */}
      {lists.length === 0 && !loading ? (
        <EmptyState
          title='No lists yet'
          description='Get started by creating your first shopping list. It only takes a few seconds.'
          actionLabel='Create list'
          onAction={openAddForm} />
      ) : filteredLists.length === 0 ? (
        <EmptyState
                  title='No items found'
                  description={`Nothing matches "${search}". Try a different search term`} />
          ) : (
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredLists.map((list) => (
                <div key={list.id} className='rounded-xl border bg-white p-4'>
                  <div className='flex items-start justify-between'>
                    <p className='font-medium'>{list.name}</p>
                    <button aria-label={`Share ${list.name}`}>
                      <Share2 size={16} className='text-gray-400 hover:text-gray-600' />
                    </button>
                  </div>
                  <p className='mb-2.5 mt-1.5 text-sm text-gray-500'>{list.items.length} items</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${categoryStyles[list.category] || 'bg-gray-100 text-gray-700'}`}>
                    {list.category}
                  </span>
                  <div className='mt-3.5 flex justify-end gap-2.5'>
                    <button aria-label={`Edit ${list.name}`} onClick={() => openEditForm(list)}>
                      <Pencil size={19} className='text-gray-500 hover:text-gray-700' />
                    </button>
                    <button aria-label={`Delete ${list.name}`} onClick={() => setDeleteTarget(list)}>
                      <Trash2 size={19} className='text-red-500 hover:text-red-600' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

      <ShoppingListForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingList(null) }}
        onSubmit={handleFormSubmit}
        initialData={editingList}
        loading={loading}
      />

      <ConfirmationModal
        open={!!deleteTarget}
        title='Delete list?'
        description={`This will permanently delete "${deleteTarget?.name}" and all its items.`}
        confirmLabel='Delete'
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={loading}
      />
    </div>
    </>
  )
}

export default Home
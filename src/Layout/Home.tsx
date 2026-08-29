import NavBar from '@/Layout/NavBar'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/Redux/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Share2, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { confirmationModal as ConfirmationModal } from '@/components/ui/confirmationModal'
import { fetchLists, addList, updateList, deleteList } from '@/Redux/shoppingThunks'
import type { ShoppingListInput, ShoppingList } from '@/Redux/shoppingTypes'
import { shoppingListForm as ShoppingListForm } from '@/components/ui/shoppingListForm'
import { shareModal as ShareModal } from '@/components/ui/shareModal'
import ListDetailModal from '@/Layout/ListDetailModal'


const categoryStyles: Record<string, string> = {
    Groceries: 'bg-teal-50 text-teal-800',
    Household: 'bg-amber-50 text-amber-800',
    Events: 'bg-pink-50 text-pink-800',
    Electronics: 'bg-blue-50 text-blue-800',
    others: 'bg-gray-100 text-gray-700',
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
  const [shareTarget, setShareTarget] = useState<ShoppingList | null>(null)
  const [viewingList, setViewList] = useState<ShoppingList | null>(null)

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
          await dispatch(updateList({ id: editingList.id, data})).unwrap()
          setSuccessMessage('List updated successfully!')
        } else {
          await dispatch(addList(data)).unwrap()
          setSuccessMessage('List created created successfully!')
        }
        setFormOpen(false)
        setEditingList(null)
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

      <div className='mx-auto max-w-6xl space-y-8 px-4 py-10'>
       {/* success message */}
      {successMessage && (
        <div role='alert' className='flex items-center gap-2 rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-800'>
          <CheckCircle2 size={16} />
          {successMessage}
        </div>
      )}

      {/* search & sort */}
      <div className='flex flex-col gap-2 sm:flex-row'>
         {/* Header */}
       <div className='relative flex-1'>
         <Search size={20} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
         <Input type='text'
                placeholder='Search items'
                className='rounded-[8px] pl-9'
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
       </div>
        <select value={sort}
                onChange={(e) => setSort(e.target.value)}
                className='w-full rounded-[8px] border border-gray-200 bg-white px-3 text-sm text-gray-700 sm:w-40'>
                 <option value='name'>Sort by: Name</option> 
                 <option value='category'>Sort by: Category</option>
                 <option value='date'>Sort by: Date added</option>
                </select>
          <Button onClick={openAddForm} className='flex w-full items-center justify-center rounded-[8px] bg-[#0A0A0A] hover:bg-gray-800 sm:w-auto'>
            New list
          </Button>
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
                <div key={list.id} onClick={() => setViewList(list)} className='cursor-pointer rounded-xl border bg-white p-4 hover:border-gray-300'>
                  <div className='flex items-start justify-between'>
                    <p className='font-medium'>{list.name}</p>
                    <button aria-label={`Share ${list.name}`} onClick={(e) => { e.stopPropagation(); setShareTarget(list) }}>
                      <Share2 size={16} className='text-gray-400 hover:text-gray-600' />
                    </button>
                  </div>
                  <p className='mb-2.5 mt-1.5 text-sm text-gray-500'>{list.items.length} items</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${categoryStyles[list.category] || 'bg-gray-100 text-gray-700'}`}>
                    {list.category}
                  </span>
                  <div className='mt-3.5 flex justify-end gap-2.5'>
                    <button aria-label={`Edit ${list.name}`} onClick={(e) =>  { e.stopPropagation(); openEditForm(list)} }>
                      <Pencil size={19} className='text-gray-500 hover:text-gray-700' />
                    </button>
                    <button aria-label={`Delete ${list.name}`} onClick={(e) => { e.stopPropagation(); setDeleteTarget(list)} }>
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

      <ShareModal 
         open={!!shareTarget}
         listName={shareTarget?.name || ''}
         shareUrl={shareTarget ? `${window.location.origin}/shared/${shareTarget.id}` : ''}
         onClose={() => setShareTarget(null)} />

      <ListDetailModal 
                open={!!viewingList}
                list={viewingList}
                onClose={() => setViewList(null)}
                onEdit={(list) => {
                  setViewList(null)
                  openEditForm(list)
                }} />
    </div>
   </>
  )
}

export default Home
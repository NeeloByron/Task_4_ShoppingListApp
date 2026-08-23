import NavBar from '@/Layout/NavBar'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/Redux/store'
import { Button } from '@base-ui/react/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Share2, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

type ShoppingList = {
    id: string;
    name: string;
    itemCount: number;
    category: string;
}

{/*temporary still going to use shopping slice */}
const placeholderLists: ShoppingList[] = [
    { id: '1', name: 'Weekly groceries', itemCount: 12, category: 'Groceries'},
    { id: '2', name: 'Cleaning supplies', itemCount: 5, category: 'Household'},
    { id: '3', name: 'Birthday party', itemCount: 8, category: 'Events'},
    { id: '4', name: 'Electronics', itemCount: 3, category: 'Electronics'},

]

const categoryStyles: Record<string, string> = {
    Groceries: 'bg-teal-50 text-teal-800',
    Household: 'bg-teal-50 text-teal-800',
    Events: 'bg-teal-50 text-teal-800',
    Electronics: 'bg-teal-50 text-teal-800',
}

export const Home = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('date')

  const filteredLists = placeholderLists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase())
)

  return (
    <>
      <NavBar />

      <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
        {/* Header */}
         <div className='flex items-center justify-between'>
           
            <Button onClick={() => navigate('/lists/new')} className='flex items-center gap-2'>
                <Plus size={16} />
                New list
            </Button>
         </div>

         {/* search & sort */}
         <div className='flex gap-2'>
            <div className='relative flex-1'>
                <Search size={20} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <Input type='text'
                       placeholder='search items'
                       className='rounded-md pl-9'
                       value={search}
                       onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className='w-40 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700'>
              <option value='date'>Sort by: Date added</option>
              <option value='date'>Sort by: Name</option>
              <option value='date'>Sort by: Category</option>
            </select>
         </div>

         {/* list cards */}
         <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredLists.map((list) =>(
            <div key={list.id} className='rounded-xl border bg-white p-4'>
              <div className='flex items-start justify-between'>
               <p className='font-medium'>{list.name}</p>
               <button aria-label={`Share ${list.name}`}>
                <Share2 size={16} className='text-gray-400 hover:text-gray-600' />
               </button>
              </div>
              <p className='mb-2.5 mt-1.5 text-sm text-gray-500'>{list.itemCount} items</p>
              <span className={`rounded-full px-2.5 py-1 text-xs ${categoryStyles[list.category] || 'bg-gray-100 text-gray-700'}`}>
                {list.category}
              </span>
              <div className='mt-3.5 flex justify-end gap-2.5'>
                <button aria-label={`Edit ${list.name}`}>
                  <Pencil size={19} className='text-gray-500 hover:text-gray-700' />
                </button>
                <button aria-label={`Delete ${list.name}`}>
                  <Trash2 size={19} className='text-red-500 hover:text-red-600' />
               </button>
            </div>
            </div>
          ))}
         </div>
         
         {filteredLists.length === 0 && (
          <p className='col-span-full py-8 text-center text-sm text-gray-500'>No list match "{search}".</p>
         )}
         <p className='text-sm text-gray-500'>{filteredLists.length}</p>
      </div>
    </>
  )
}

export default Home
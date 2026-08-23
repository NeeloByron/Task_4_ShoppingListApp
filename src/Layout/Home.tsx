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
            <div>
                <p className='text-lg font-medium'>My shopping lists</p>
                <p className='text-sm text-gray-500'>{filteredLists.length}</p>
            </div>
            <Button onClick={() => navigate('/lists/new')} className='flex gap-2'>
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

                    </select>
         </div>
         
      </div>
    </>
  )
}

export default Home
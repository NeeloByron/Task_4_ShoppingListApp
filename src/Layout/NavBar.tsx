import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@base-ui/react/button'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/Redux/store'
import { logout } from '@/Redux/authslice'


export const NavBar = () => {
    const dispath = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
        dispath(logout())
        navigate('/login')
    }

    const navLinks = [
        { label: 'Home', to:'/dashboard' },
        { label: 'My Lists', to:'/lists' },
        { label: 'Profile', to:'/profile' },
    ]

  return (
        <>
         <nav className='border-b bg-black'>
          <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
           <Link to='/dashboard' className='text-lg font-bold tracking-tight text-gray-100 hover:text-gray-500'>
             ShopList
           </Link>

          {/* Desktop links */}
           <div className='hidden items-center gap-6 md:flex'>
           {navLinks.map((link) => (
             <Link
               key={link.to}
               to={link.to}
               className='text-sm font-medium text-gray-100 hover:text-gray-500'>
               {link.label}
             </Link>
           ))}
         </div>

        {/* Desktop user info + logout */}
        <div className='hidden items-center gap-4 md:flex'>
          <div className='flex items-center gap-2 text-sm text-gray-100 hover:text-gray-500'>
            <User size={18} />
            <span>{user?.name} {user?.surname}</span>
          </div>
          <Button onClick={handleLogout} className='gap-2 text-gray-100 hover:text-gray-500'>
            Logout
          </Button>
        </div>

         {/* Mobile hamburger */}
         <button
           className='md:hidden'
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

       {/* Mobile menu panel */}
       {mobileOpen && (
         <div className='space-y-3 border-t bg-white px-4 py-4 md:hidden'>
           {navLinks.map((link) => (
             <Link
               key={link.to}
               to={link.to}
               onClick={() => setMobileOpen(false)}
               className='block text-sm font-medium text-gray-100 hover:text-gray-500'>
               {link.label}
             </Link>
            ))}

           <div className='flex items-center gap-2 pt-2 text-sm text-gray-700'>
             <User size={16} />
             <span>{user?.name} {user?.surname}</span>
           </div>

           <Button onClick={handleLogout} className='w-full gap-2'>
             <LogOut size={16} />
             Logout
           </Button>
         </div>
       )}
    </nav>
   </>
  )
}

export default NavBar

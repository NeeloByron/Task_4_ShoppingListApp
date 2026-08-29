import ShoppingListApp from '@/Layout/ShoppingListApp'
import { ToastProvider } from '@/components/ui/toast'

function App() {
  return (
     <>
      <ToastProvider position='top-right'>
        <ShoppingListApp />
      </ToastProvider>
     </>
  )
}

export default App

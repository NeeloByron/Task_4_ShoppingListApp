import NavBar from '@/Layout/NavBar'

export const Home = () => {
  return (
      <>
        <NavBar />
          <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
             <div className='rounded-xl bg-white p-8 text-black'>
               <h1 className='text-2xl font-bold tracking-tight'>
                  Welcome back, 
                  </h1>
                 <p className='mt-1 text-sm text-black'>
               Here's an overview of your shopping lists.
            </p>
          </div>
        </div>
     </>
  )
}

export default Home
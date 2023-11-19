import Bottom from '@/components/shared/Bottom'
import SideBar from '@/components/shared/SideBar'
import TopBar from '@/components/shared/TopBar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <TopBar></TopBar>
      <SideBar></SideBar>

      <section className='flex flex-1 h-full'>
        <Outlet></Outlet>
      </section>
      <Bottom></Bottom>
    </div>

  )
}

export default RootLayout
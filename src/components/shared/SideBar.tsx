import { sidebarLinks } from '@/constants'
import { useAuthUser } from '@/hooks/userContext'
import { logout, profile } from '@/public/assets/icons'
import { logo } from '@/public/assets/images'
import { useSignOutAccount } from '@/react-query/queriesAndMutation'
import { INavLink } from '@/types'
import { useEffect } from 'react'
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'

const SideBar = () => {
  const { user } = useAuthUser();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) navigate('/sign-in')


  }, [isSuccess])

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to={'/'} className='flex items-center gap-3'>
          <img src={logo} alt="sidebar logo " width={170} height={36} />
        </Link>
        <Link to={`/profile/${user.id}`} className='flex items-center gap-3 '>
          <img src={user.imageUrl || profile} alt="" className='w-12 h-12 rounded-full' />
          <div className='flex flex-col'>
            <p className='body-bold'>{user.name}</p>
            <p className='small-regular text-light-3'>@{user.username}</p>
          </div>
        </Link>
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'} `}>
                <NavLink to={link.route} className={'flex gap-4 py-4 items-center '}>
                  <img src={link.imgURL} alt="" className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                  {link.label}
                </NavLink>


              </li>
            )


          })}
        </ul>
      </div>
      <Button onClick={() => signOut()} variant={'ghost'} className='shad-button_ghost'>
        <img src={logout} alt="logout " />
        <p className='capitalize small-medium'>logout</p>
      </Button>
    </nav>
  )
}

export default SideBar
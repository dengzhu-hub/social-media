import React from 'react'
import { bottombarLinks } from '@/constants/index';
import { useLocation, Link } from 'react-router-dom';
const Bottom = () => {
    const { pathname } = useLocation();
    return (
        <section className='bottom-bar bg-green-400'>
            {
                bottombarLinks.map((link) => {
                    const isActive = pathname === link.route;
                    return (
                        <Link to={link.route} key={link.label} className={` flex gap-2 flex-col  justify-center items-center transition ${isActive && 'bg-primary-500'} rounded-md p-2`}>
                            <img src={link.imgURL} alt="" width={16} height={16} className={` ${isActive && 'invert-white'}`} />
                            <p className='tiny-medium text-light-2'>{link.label}</p>
                        </Link>


                    )


                })
            }
        </section>





    )
}

export default Bottom
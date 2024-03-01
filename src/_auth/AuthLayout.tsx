import { Navigate, Outlet } from 'react-router-dom';
import { side } from '../public/assets/images'
import { useAuthUser } from '@/hooks/userContext';

const AuthLayout = () => {
    const {isAuthenticated} = useAuthUser()
    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/"></Navigate>
            ) : (
                <>
                    <section className='flex flex-col items-center justify-center flex-1 py-10 '>
                        <Outlet />
                    </section>
                    <img className='hidden object-cover w-1/2 bg-no-repeat xl:block' src={side} alt="" />
                </>


            )}
        </>

    )
}

export default AuthLayout
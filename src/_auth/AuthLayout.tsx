import { Navigate, Outlet } from 'react-router-dom';
import { side } from '../public/assets/images'

const AuthLayout = () => {
    const isAuthenticated: boolean = false;
    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/"></Navigate>
            ) : (
                <>
                    <section className='flex flex-col py-10 justify-center flex-1  items-center '>
                        <Outlet />
                    </section>
                    <img className='hidden xl:block object-cover w-1/2 bg-no-repeat' src={side} alt="" />
                </>


            )}
        </>

    )
}

export default AuthLayout
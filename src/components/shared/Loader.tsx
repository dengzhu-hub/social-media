import { loader } from '@/public/assets/icons'
import { ReactNode } from 'react'

const Loader = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex-center w-full gap-2 text-2xl'>
            <img width={24} height={24} src={loader} alt="" />
            {children}
        </div>
    )
}

export default Loader
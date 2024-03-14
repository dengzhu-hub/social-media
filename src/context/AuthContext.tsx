import {createContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IContextType, IUser } from '@/types';
import { getCurrentUser } from '@/lib/appwrite/api';
const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean
}


export const AuthContext = createContext<IContextType>(INITIAL_STATE);


const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const checkAuthUser = async () => {

        try {
            const currentAccount = await getCurrentUser();

            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    bio: currentAccount.bio,
                    imageUrl: currentAccount.imageUrl,
                })
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error')
        }
        finally {
            setIsLoading(false);

        }

    };
    useEffect(() => {
        // localStorage.getItem('cookieFallback') === null) {
        if (localStorage.getItem('cookieFallback') === undefined) {
            navigate('/sign-in');
        }
        checkAuthUser();

    }, [])
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,

    }
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}


export default AuthContextProvider;

import React from 'react'
import { Routes, Route } from 'react-router-dom';
import './global.css';
import { SignIn, SignUp } from './_auth/forms';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Home } from './_root/pages';
import { Toaster } from "@/components/ui/toaster";
const App = () => {
    return (
        <main className='flex'>
            <Routes>
                {/* public route  */}
                <Route element={<AuthLayout />}>

                    <Route path='sign-in' element={<SignIn />}>sign in</Route>
                    <Route path='sign-up' element={<SignUp />}>sign in</Route>
                </Route>

                {/* private route  */}
                <Route element={<RootLayout />}>

                    <Route index element={<Home />}></Route>
                </Route>
            </Routes>

            <Toaster />
        </main>
    )
}

export default App
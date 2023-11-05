import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from "./context/AuthContext";
import QueryProvider from "./react-query/QueryProvider";
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryProvider>

                <AuthContextProvider>

                    <App />
                </AuthContextProvider>
            </QueryProvider>
        </BrowserRouter>
    </React.StrictMode>
)



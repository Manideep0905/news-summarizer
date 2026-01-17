import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Routes, Route, RouterProvider } from 'react-router-dom'
import { Articles, LoginPage } from './pages/index.js'
import { AuthLayout } from './layout/index.js'

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/'>
                <Route path='' element={<App />} />
                <Route path='/articles/:category' element={<Articles />} />
            </Route>
            <Route element={<AuthLayout />}> 
                <Route path='/login' element={<LoginPage />} />
            </Route>
        </>
    )
);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)

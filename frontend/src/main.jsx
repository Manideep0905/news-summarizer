import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, createRoutesFromElements, Routes, Route, RouterProvider } from 'react-router-dom'
import { Articles, LoginPage, DetailPage, MyArticlesPage, RegisterPage, SummarizePage } from './pages/index.js'
import { AuthLayout, MainLayout } from './layout/index.js'
import { ArticleForm } from './components/index.js'

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<MainLayout />}>
                <Route path='' element={<App />} />
                <Route path='/articles/form' element={<ArticleForm />} />
                <Route path='/articles/:category' element={<Articles />} />
                <Route path='/articles/detail' element={<DetailPage />} />
                <Route path='/articles/summary' element={<SummarizePage />} />
                <Route path='/my-articles' element={<MyArticlesPage />} />
            </Route>
            <Route element={<AuthLayout />}> 
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
            </Route>
        </>
    )
);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
)

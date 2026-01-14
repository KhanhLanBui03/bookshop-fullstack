import AuthLayout from "@/layouts/AuthLayout"
import MainLayout from "@/layouts/MainLayout"
import AboutPage from "@/pages/AboutPage"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import NotFound from "@/pages/NotFound"
import RegisterPage from "@/pages/RegisterPage"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/about", element: <AboutPage /> }
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    },
    {
        element: <AuthLayout/>,
        children: [
            { path: "/login", element: <LoginPage/> },
            { path: "/register", element: <RegisterPage/> },
        ]
    }
])
export default router
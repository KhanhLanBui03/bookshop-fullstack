import AuthLayout from "@/layouts/AuthLayout"
import MainLayout from "@/layouts/MainLayout"
import AboutPage from "@/pages/AboutPage"
import AuthorBooksPage from "@/pages/AuthorBooks"
import BookDetail from "@/pages/BookDetail"
import CartPage from "@/pages/CartPage"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import NotFound from "@/pages/NotFound"
import RegisterPage from "@/pages/RegisterPage"
import Support from "@/pages/SupportPage"
import ProtectedRoute from "@/components/ProtectedRoute"
import { createBrowserRouter } from "react-router-dom"
import BookListPage from "@/pages/BookListPage"
import CheckoutPage from "@/pages/CheckoutPage"

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/about", element: <AboutPage /> },
            { path: "/support", element: <Support /> },
            { 
                path: "/cart", 
                element: <ProtectedRoute><CartPage /></ProtectedRoute> 
            },
            { path: "/books/:id", element: <BookDetail /> },
            { path: "/author-detail", element: <AuthorBooksPage /> },
            {path: "/list-books", element: <BookListPage/>},
            {path: "/checkout", element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>}
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
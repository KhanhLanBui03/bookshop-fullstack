
import { AnalyticsPage } from "@/feature/analytics/pages/AnalyticsPage"
import LoginPage from "@/feature/auth/pages/LoginPage"
import RegisterPage from "@/feature/auth/pages/RegisterPage"
import { BookManagementPage } from "@/feature/book/pages/BookPage"
import { DashboardPage } from "@/feature/dashboard/pages/DashboardPage"
import { OrdersPage } from "@/feature/order/pages/OrderPage"
import { SettingsPage } from "@/feature/setting/pages/SettingsPage"

import AdminLayout from "@/layout/AdminLayout"
import AuthLayout from "@/layout/AuthLayout"
import NotFound from "@/shared/components/NotFound"
import { createBrowserRouter } from "react-router-dom"


const router = createBrowserRouter([
    {
        element: <AdminLayout />,
        children: [
            { index: true, element: <DashboardPage/> },
            {path:"/analytics", element: <AnalyticsPage/>},
            {path:"/settings", element: <SettingsPage/>},
            {path:"/orders", element: <OrdersPage/>},
            {path:"/books", element:<BookManagementPage/>},
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ],
    },
        {
            path: "*",
            element: <NotFound />,
        },
])

export default router
import { Outlet } from "react-router-dom"
import { Topbar } from "@/shared/components/Topbar"
import { Sidebar, type Page } from "@/shared/components/Sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/feature/auth/contexts/AuthContext"
import { useEffect } from "react"
const AdminLayout = () => {
    const { user, isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const getActivePage = (): Page => {
        if (location.pathname === "/") return "dashboard"
        return location.pathname.slice(1) as Page
    }
    useEffect(() => {
    if (loading) return

    if (!isAuthenticated || !user?.roles.includes("ROLE_ADMIN")) {
        navigate("/login", { replace: true })
    }
}, [user, isAuthenticated, loading])
    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    )

    if (!isAuthenticated || !user?.roles.includes("ROLE_ADMIN")) return null

    return (
        <div className="relative flex min-h-screen bg-background text-foreground antialiased overflow-hidden w-full">
            <Sidebar
                active={getActivePage()}
                onNavigate={(page) => navigate(`/${page === "dashboard" ? "" : page}`)}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
                <Topbar title="Quản trị Hệ thống" subtitle="Theo dõi và vận hành cửa hàng sách của bạn" />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide bg-muted/40 border-l border-border/20">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
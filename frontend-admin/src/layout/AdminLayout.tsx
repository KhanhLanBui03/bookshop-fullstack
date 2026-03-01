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
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "var(--bg2, #111117)",   // 👈 nền chung toàn app
                color: "#f8fafc",
            }}
        >
            <Sidebar
                active={getActivePage()}
                onNavigate={(page) => navigate(`/${page === "dashboard" ? "" : page}`)}
            />

            <div style={{ marginLeft: 220, width: "100%" }}>
                <Topbar title="Admin Dashboard" subtitle="Manage your bookstore" />

                <main
                    style={{
                        flex: 1,
                        padding:10,
                        background: "var(--bg2, #111117)",  // 👈 bắt buộc có cái này
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
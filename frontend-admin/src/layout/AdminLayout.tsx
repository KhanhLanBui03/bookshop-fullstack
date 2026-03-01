import { Outlet } from "react-router-dom"
import { Topbar } from "@/shared/components/Topbar"
import { Sidebar } from "@/shared/components/Sidebar"
import { useNavigate, useLocation } from "react-router-dom"
const AdminLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "var(--bg)",   // 👈 nền chung toàn app
                color: "#f8fafc",
            }}
        >
            <Sidebar
                active={location.pathname === "/" ? "dashboard" : "books"}
                onNavigate={(page) => navigate(`/${page === "dashboard" ? "" : page}`)}
            />

            <div style={{ marginLeft: 220, width: "100%" }}>
                <Topbar title="Admin Dashboard" subtitle="Manage your bookstore" />

                <main
                    style={{
                        flex: 1,
                        padding: 24,
                        background: "#0f172a",  // 👈 bắt buộc có cái này
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
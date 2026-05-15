import React from "react"
import {
  Book, ChartLine, LayoutDashboard,
  ListOrdered, Settings2, UsersRound, LogOut,
  Tag,
  MessageSquare,
  Package,
  PenTool
} from "lucide-react"
import { useAuth } from "@/feature/auth/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

/* ════════ TYPES ════════ */
export type Page =
  | "dashboard"
  | "books"
  | "orders"
  | "customers"
  | "analytics"
  | "settings"
  | "categories"
  | "reviews"
  | "inventory"
  | "blogs"

interface NavItem {
  id: Page
  icon: React.ReactNode
  label: string
  badge?: string
  badgeColor?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

/* ════════ NAV DATA ════════ */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Hệ thống",
    items: [
      { id: "dashboard", icon: <LayoutDashboard className="size-4" />, label: "Tổng quan" },
      { id: "books", icon: <Book className="size-4" />, label: "Sách", badge: "New" },
      { id: "categories", icon: <Tag className="size-4" />, label: "Danh mục" },
      { id: "orders", icon: <ListOrdered className="size-4" />, label: "Đơn hàng", badge: "3" },
      { id: "inventory", icon: <Package className="size-4" />, label: "Kho hàng" },
      { id: "blogs", icon: <PenTool className="size-4" />, label: "Bài viết" },
      { id: "customers", icon: <UsersRound className="size-4" />, label: "Khách hàng" },
      { id: "reviews", icon: <MessageSquare className="size-4" />, label: "Đánh giá" }
    ],
  },
  {
    label: "Báo cáo & Cài đặt",
    items: [
      { id: "analytics", icon: <ChartLine className="size-4" />, label: "Phân tích" },
      { id: "settings", icon: <Settings2 className="size-4" />, label: "Cài đặt" },
    ],
  },
]

/* ════════ COMPONENT ════════ */
export const Sidebar = ({ active, onNavigate }: { active: Page, onNavigate: (page: Page) => void }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <aside className="w-[300px] min-w-[300px] flex-shrink-0 bg-white dark:bg-card border-r border-border/50 flex flex-col h-screen z-50 sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* ── Logo ── */}
      <div className="p-8 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Book className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tighter">Libraria</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Admin Console</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-4">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-4">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/25 scale-[1.02]" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`transition-all duration-300 ${isActive ? "text-primary-foreground scale-110" : "group-hover:text-primary"}`}>
                        {item.icon}
                      </div>
                      <span className={`text-[13px] tracking-tight transition-all ${isActive ? "font-black" : "font-bold"}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter ${
                        isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(var(--primary),0.5)]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User section ── */}
      <div className="p-6 border-t border-border/50">
        <div className="glass p-4 rounded-[2rem] border-white/5 flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                {user?.name?.slice(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-card rounded-full" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-tighter">Administrator</p>
          </div>

          <button 
            onClick={handleLogout}
            className="size-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm"
            title="Đăng xuất"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
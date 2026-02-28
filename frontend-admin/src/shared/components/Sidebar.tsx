import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Book, ChartLine, LayoutDashboard, ListOrdered, Settings2, UsersRound } from "lucide-react"

export type Page =
  | "dashboard"
  | "books"
  | "orders"
  | "customers"
  | "analytics"
  | "settings"

interface NavItem {
  id: Page
  icon: string
  label: string
  badge?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "MAIN",
    items: [
      { id: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
      { id: "books", icon: <Book />, label: "Books", badge: "9" },
      { id: "orders", icon: <ListOrdered />, label: "Orders", badge: "3" },
      { id: "customers", icon: <UsersRound />, label: "Customers" },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { id: "analytics", icon: <ChartLine />, label: "Analytics" },
      { id: "settings", icon: <Settings2 />, label: "Settings" },
    ],
  },
]

interface SidebarProps {
  active: Page
  onNavigate: (page: Page) => void
}

export const Sidebar = ({ active, onNavigate }: SidebarProps) => {
  return (
    <aside
      style={{
        width: 230,
        background: "#0f172a",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          
          <div>
            <img
              src="/log5.png"
              alt="Logo"
              style={{
                width: 60,
                height: 50,
                
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#f8fafc",
              }}
            >
              Libraria
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 2,
              }}
            >
              bookstore · admin
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="sidebar-scroll"
        style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#64748b",
                letterSpacing: 1.5,
                marginBottom: 8,
                paddingLeft: 8,
              }}
            >
              {group.label}
            </div>

            {group.items.map((item) => {
              const isActive = active === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 10,
                    marginBottom: 6,
                    cursor: "pointer",
                    background: isActive ? "#1e293b" : "transparent",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "#1e293b"
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: isActive ? "#6366f1" : "#1e293b",
                        color: "#fff",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User section */}
      <div
        style={{
          padding: "16px 14px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px",
            borderRadius: 12,
            background: "#1e293b",
          }}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#f8fafc",
              }}
            >
              Admin
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              admin@libraria.vn
            </div>
          </div>

          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
            }}
          />
        </div>
      </div>
    </aside>
  )
}
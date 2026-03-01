import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Book, ChartLine, LayoutDashboard,
  ListOrdered, Settings2, UsersRound, LogOut, Bell,
} from "lucide-react"
import { useAuth } from "@/feature/auth/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

/* ════════ TYPES ════════ */
export type Page =
  | "dashboard"
  | "books"
  | "orders"
  | "customers"
  | "analytics"
  | "settings"

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
    label: "MAIN",
    items: [
      { id: "dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
      { id: "books", icon: <Book size={16} />, label: "Books", badgeColor: "var(--accent, #ff6b35)" },
      { id: "orders", icon: <ListOrdered size={16} />, label: "Orders", badgeColor: "var(--accent, #ff6b35)" },
      { id: "customers", icon: <UsersRound size={16} />, label: "Customers" },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { id: "analytics", icon: <ChartLine size={16} />, label: "Analytics" },
      { id: "settings", icon: <Settings2 size={16} />, label: "Settings" },
    ],
  },
]

/* ════════ CSS ════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .sb-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .sb-wrap {
    width: 230px;
    background: var(--bg2, #111117);
    border-right: 1px solid var(--border, rgba(255,255,255,0.07));
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 30;
    font-family: var(--font-body, 'DM Sans', sans-serif);
  }

  .sb-wrap::-webkit-scrollbar { width: 0; }

  .sb-nav-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    border-radius: 10px;
    margin-bottom: 2px;
    cursor: pointer;
    transition: all .15s ease;
    color: var(--muted, #6b6880);
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }
  .sb-nav-item::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background: linear-gradient(90deg, rgba(255,107,53,0.06) 0%, transparent 100%);
    transition: opacity .15s ease;
  }
  .sb-nav-item:hover {
    background: rgba(255,255,255,0.04);
    color: var(--muted2, #9490a8);
  }
  .sb-nav-item.active {
    background: rgba(255,107,53,0.1);
    border-color: rgba(255,107,53,0.18);
    color: var(--text, #e8e4f0);
  }
  .sb-nav-item.active::before { opacity: 1; }
  .sb-nav-item.active .sb-icon { color: var(--accent, #ff6b35); }
  .sb-nav-item.active .sb-label { font-weight: 600; }

  .sb-icon {
    transition: color .15s ease;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .sb-user-card {
    transition: background .15s ease;
    cursor: pointer;
    border-radius: 12px;
  }
  .sb-user-card:hover { background: rgba(255,255,255,0.05) !important; }

  .sb-logout-btn {
    transition: all .15s ease;
    cursor: pointer;
    border: none;
  }
  .sb-logout-btn:hover {
    background: rgba(239,68,68,0.1) !important;
    color: var(--red, #ef4444) !important;
    border-color: rgba(239,68,68,0.2) !important;
  }

  .sb-notif-btn {
    transition: background .15s ease;
    cursor: pointer;
    border: none;
  }
  .sb-notif-btn:hover { background: rgba(255,255,255,0.08) !important; }

  @keyframes sbPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
  }
  .sb-online { animation: sbPulse 2.5s ease infinite; }

  .sb-active-bar {
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    background: var(--accent, #ff6b35);
    border-radius: 0 3px 3px 0;
    opacity: 0;
    transition: opacity .15s ease;
  }
  .sb-nav-item.active .sb-active-bar { opacity: 1; }
`

/* ════════ PROPS ════════ */
interface SidebarProps {
  active: Page
  onNavigate: (page: Page) => void
}

/* ════════ COMPONENT ════════ */
export const Sidebar = ({ active, onNavigate }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const mono: React.CSSProperties = { fontFamily: "var(--font-mono, 'DM Mono', monospace)" }
  const {user,logout} = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }
  return (
    <aside className="sb-wrap">
      <style>{CSS}</style>

      {/* ── Logo ── */}
      <div style={{
        padding: "22px 18px 18px",
        borderBottom: "1px solid var(--border, rgba(255,255,255,0.07))",
        flexShrink: 0,
      }}>
      
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo mark */}
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, var(--accent, #ff6b35) 0%, #ff9a6c 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(255,107,53,0.35)",
          }}>
            <Book size={18} color="#fff" strokeWidth={2.2} />
          </div>

          <div>
            <div style={{
              fontFamily: "var(--font-display, 'Fraunces', serif)",
              fontSize: 17, fontWeight: 700,
              color: "var(--text, #e8e4f0)",
              letterSpacing: "-0.3px",
            }}>
              Libraria
            </div>
            <div style={{
              ...mono, fontSize: 10,
              color: "var(--muted, #6b6880)",
              marginTop: 1, letterSpacing: 0.5,
            }}>
              bookstore · admin
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 24 }}>

            {/* Group label */}
            <div style={{
              ...mono, fontSize: 9, fontWeight: 600,
              color: "var(--muted, #6b6880)",
              letterSpacing: 1.8,
              marginBottom: 6, paddingLeft: 12,
              textTransform: "uppercase",
            }}>
              {group.label}
            </div>

            {/* Items */}
            {group.items.map((item) => {
              const isActive = active === item.id
              return (
                <div
                  key={item.id}
                  className={`sb-nav-item${isActive ? " active" : ""}`}
                  onClick={() => onNavigate(item.id)}
                >
                  {/* Active left bar */}
                  <div className="sb-active-bar" />

                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span className="sb-icon">{item.icon}</span>
                    <span className="sb-label" style={{ fontSize: 13, fontWeight: 500 }}>
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span style={{
                      ...mono, fontSize: 10, fontWeight: 700,
                      padding: "1px 7px", borderRadius: 99,
                      background: isActive
                        ? (item.badgeColor ?? "var(--accent)") + "25"
                        : "rgba(255,255,255,0.06)",
                      color: isActive
                        ? (item.badgeColor ?? "var(--accent)")
                        : "var(--muted2, #9490a8)",
                      border: `1px solid ${isActive ? (item.badgeColor ?? "var(--accent)") + "30" : "transparent"}`,
                      transition: "all .15s ease",
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "var(--border, rgba(255,255,255,0.07))", margin: "0 16px" }} />

      {/* ── Notification strip ── */}
      <div style={{ padding: "10px 12px 0" }}>
        <button className="sb-notif-btn" style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 10,
          background: "rgba(245,158,11,0.07)",
          border: "1px solid rgba(245,158,11,0.15)",
          color: "var(--amber, #f59e0b)", cursor: "pointer",
        }}>
          <Bell size={13} />
          <span style={{ ...mono, fontSize: 11, flex: 1, textAlign: "left" }}>3 pending orders</span>
          <span style={{
            ...mono, fontSize: 9, fontWeight: 700,
            background: "var(--amber, #f59e0b)", color: "#000",
            padding: "1px 6px", borderRadius: 99,
          }}>!</span>
        </button>
      </div>

      {/* ── User section ── */}
      <div style={{ padding: "12px 12px 16px", flexShrink: 0 }}>
        <div className="sb-user-card" style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border, rgba(255,255,255,0.07))",
        }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Avatar style={{ width: 34, height: 34 }}>
              <AvatarFallback style={{
                background: "rgba(255,107,53,0.15)",
                color: "var(--accent, #ff6b35)",
                fontFamily: "var(--font-mono)",
                fontSize: 12, fontWeight: 700,
              }}>
                AD
              </AvatarFallback>
            </Avatar>
            {/* Online dot */}
            <div className="sb-online" style={{
              position: "absolute", bottom: 0, right: 0,
              width: 9, height: 9, borderRadius: "50%",
              background: "var(--green, #22c55e)",
              border: "2px solid var(--bg2, #111117)",
            }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text, #e8e4f0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name}
            </div>
            <div style={{ ...mono, fontSize: 10, color: "var(--muted, #6b6880)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </div>
          </div>

          {/* Logout */}
          <button className="sb-logout-btn" title="Logout" style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--muted, #6b6880)",
          }}>
            <LogOut onClick={handleLogout} size={12} />
          </button>
        </div>
      </div>
    </aside>
  )
}
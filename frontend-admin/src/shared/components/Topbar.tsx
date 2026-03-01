import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, useEffect } from "react"
import { Bell, Search, ChevronDown, Sun, Moon, Settings } from "lucide-react"

/* ════════ CSS ════════ */
const CSS = `
  .tb * { box-sizing: border-box; margin: 0; padding: 0; }

  .tb {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
    background: var(--bg2, #111117);
    position: sticky;
    top: 0;
    z-index: 20;
    font-family: var(--font-body, 'DM Sans', sans-serif);
    backdrop-filter: blur(12px);
  }

  /* Search */
  .tb-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg3, #18181f);
    border: 1px solid var(--border, rgba(255,255,255,0.07));
    border-radius: 10px;
    padding: 8px 12px;
    transition: border-color .15s ease, box-shadow .15s ease;
    cursor: text;
  }
  .tb-search:focus-within {
    border-color: var(--accent, #ff6b35);
    box-shadow: 0 0 0 3px rgba(255,107,53,0.12);
  }
  .tb-search:focus-within .tb-search-icon { color: var(--accent, #ff6b35); }
  .tb-search-icon { transition: color .15s ease; }

  .tb-input {
    background: none;
    border: none;
    outline: none;
    color: var(--text, #e8e4f0);
    font-size: 13px;
    width: 176px;
    font-family: var(--font-body, 'DM Sans', sans-serif);
  }
  .tb-input::placeholder { color: var(--muted, #6b6880); }

  /* Icon buttons */
  .tb-icon-btn {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--border, rgba(255,255,255,0.07));
    background: var(--bg3, #18181f);
    cursor: pointer;
    color: var(--muted2, #9490a8);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .15s ease;
    flex-shrink: 0;
  }
  .tb-icon-btn:hover {
    background: rgba(255,255,255,0.07) !important;
    border-color: rgba(255,255,255,0.14) !important;
    color: var(--text, #e8e4f0) !important;
  }
  .tb-icon-btn.notif-active {
    border-color: rgba(255,107,53,0.3);
    background: rgba(255,107,53,0.08);
    color: var(--accent, #ff6b35);
  }

  /* Notif dot */
  @keyframes tbPop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }
  .tb-notif-dot {
    position: absolute;
    top: 7px; right: 7px;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent, #ff6b35);
    border: 2px solid var(--bg2, #111117);
    animation: tbPop .2s cubic-bezier(.22,1,.36,1);
  }
  .tb-notif-count {
    position: absolute;
    top: -4px; right: -4px;
    min-width: 16px; height: 16px;
    border-radius: 99px;
    background: var(--accent, #ff6b35);
    color: #fff;
    font-family: var(--font-mono, 'DM Mono', monospace);
    font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px;
    border: 2px solid var(--bg2, #111117);
    animation: tbPop .2s cubic-bezier(.22,1,.36,1);
  }

  /* Notif dropdown */
  @keyframes tbDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tb-notif-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 300px;
    background: var(--bg3, #18181f);
    border: 1px solid var(--border2, rgba(255,255,255,0.12));
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    animation: tbDown .2s cubic-bezier(.22,1,.36,1);
    z-index: 50;
  }
  .tb-notif-item { transition: background .1s ease; cursor: pointer; }
  .tb-notif-item:hover { background: rgba(255,255,255,0.04) !important; }

  /* User menu */
  .tb-user-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px 5px 5px;
    border-radius: 10px;
    border: 1px solid var(--border, rgba(255,255,255,0.07));
    background: var(--bg3, #18181f);
    cursor: pointer;
    transition: all .15s ease;
  }
  .tb-user-trigger:hover {
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.05);
  }

  .tb-user-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 200px;
    background: var(--bg3, #18181f);
    border: 1px solid var(--border2, rgba(255,255,255,0.12));
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    animation: tbDown .2s cubic-bezier(.22,1,.36,1);
    z-index: 50;
  }
  .tb-menu-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    transition: background .1s ease;
    font-size: 13px;
    color: var(--muted2, #9490a8);
    border: none; background: none; width: 100%; text-align: left;
    font-family: var(--font-body, 'DM Sans', sans-serif);
  }
  .tb-menu-item:hover { background: rgba(255,255,255,0.04); color: var(--text, #e8e4f0); }
  .tb-menu-item.danger:hover { background: rgba(239,68,68,0.08); color: var(--red, #ef4444); }

  /* kbd */
  .tb-kbd {
    font-family: var(--font-mono, 'DM Mono', monospace);
    font-size: 10px;
    color: var(--muted, #6b6880);
    background: var(--bg, #0c0c10);
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid var(--border, rgba(255,255,255,0.07));
    flex-shrink: 0;
  }

  /* divider */
  .tb-divider { height: 1px; background: var(--border, rgba(255,255,255,0.07)); margin: 4px 0; }

  .tb-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green, #22c55e);
    border: 2px solid var(--bg3, #18181f);
    flex-shrink: 0;
  }
`

/* ════════ MOCK NOTIFICATIONS ════════ */
const NOTIFS = [
  { id: 1, icon: "🛒", text: "New order from Nguyen Van A", time: "2m ago", unread: true },
  { id: 2, icon: "⚠️", text: "Clean Code stock low — 5 left", time: "15m ago", unread: true },
  { id: 3, icon: "📦", text: "ORD-2024-0105 shipped", time: "1h ago", unread: true },
  { id: 4, icon: "⭐", text: "Atomic Habits got a 5-star review", time: "3h ago", unread: false },
]

/* ════════ PROPS ════════ */
interface TopbarProps {
  title: string
  subtitle?: string
}

/* ════════ COMPONENT ════════ */
export const Topbar = ({ title, subtitle }: TopbarProps) => {
  const [search, setSearch] = useState("")
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFS)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter(n => n.unread).length

  const mono: React.CSSProperties = { fontFamily: "var(--font-mono, 'DM Mono', monospace)" }

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })))

  return (
    <header className="tb">
      <style>{CSS}</style>

      {/* ── LEFT: Title ── */}
      <div>
        <h1 style={{
          fontFamily: "var(--font-display, 'Fraunces', serif)",
          fontSize: 19, fontWeight: 700, lineHeight: 1,
          color: "var(--text, #e8e4f0)", letterSpacing: "-0.3px",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ ...mono, fontSize: 11, color: "var(--muted, #6b6880)", marginTop: 4 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* ── RIGHT ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Search */}
        <div className="tb-search">
          <Search size={13} className="tb-search-icon" style={{ color: "var(--muted)", flexShrink: 0 }} />
          <input
            className="tb-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <kbd className="tb-kbd">⌘K</kbd>
        </div>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className={`tb-icon-btn${unreadCount > 0 ? " notif-active" : ""}`}
            onClick={() => { setShowNotif(v => !v); setShowUser(false) }}
            title="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="tb-notif-count">{unreadCount}</span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div className="tb-notif-panel">
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px 10px",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{
                    ...mono, fontSize: 10, color: "var(--accent)", background: "none", border: "none",
                    cursor: "pointer", padding: 0,
                  }}>
                    Mark all read
                  </button>
                )}
              </div>

              {/* Items */}
              {notifs.map((n, i) => (
                <div key={n.id} className="tb-notif-item"
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "11px 16px",
                    background: n.unread ? "rgba(255,107,53,0.04)" : "transparent",
                    borderBottom: i < notifs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                  onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{n.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: n.unread ? "var(--text)" : "var(--muted2)", lineHeight: 1.4 }}>
                      {n.text}
                    </p>
                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{n.time}</p>
                  </div>
                  {n.unread && (
                    <div style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "var(--accent)", flexShrink: 0, marginTop: 4,
                    }} />
                  )}
                </div>
              ))}

              {/* Footer */}
              <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)" }}>
                <button style={{
                  ...mono, fontSize: 11, color: "var(--accent)", background: "none",
                  border: "none", cursor: "pointer", width: "100%", textAlign: "center",
                }}>
                  View all →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} style={{ position: "relative" }}>
          <div className="tb-user-trigger" onClick={() => { setShowUser(v => !v); setShowNotif(false) }}>
            {/* Avatar with online dot */}
            <div style={{ position: "relative" }}>
              <Avatar style={{ width: 28, height: 28 }}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback style={{
                  background: "rgba(255,107,53,0.15)",
                  color: "var(--accent, #ff6b35)",
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                }}>
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="tb-dot" style={{ position: "absolute", bottom: -1, right: -1 }} />
            </div>

            {/* Name */}
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>
              Admin
            </span>

            <ChevronDown
              size={13}
              style={{
                color: "var(--muted)",
                transform: showUser ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .15s ease",
              }}
            />
          </div>

          {/* User dropdown */}
          {showUser && (
            <div className="tb-user-panel">
              {/* User info */}
              <div style={{ padding: "14px 14px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Avatar style={{ width: 36, height: 36 }}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback style={{
                      background: "rgba(255,107,53,0.15)",
                      color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                    }}>AD</AvatarFallback>
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Admin</p>
                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      admin@libraria.vn
                    </p>
                  </div>
                </div>
                {/* Role badge */}
                <span style={{
                  ...mono, fontSize: 9, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 99,
                  background: "rgba(255,107,53,0.12)",
                  color: "var(--accent)",
                  border: "1px solid rgba(255,107,53,0.2)",
                }}>
                  ADMIN
                </span>
              </div>

              <div className="tb-divider" />

              {/* Menu items */}
              <div style={{ padding: "4px 0" }}>
                <button className="tb-menu-item">
                  <Settings size={14} />
                  Settings
                </button>
              </div>

              <div className="tb-divider" />

              <div style={{ padding: "4px 0 8px" }}>
                <button className="tb-menu-item danger" style={{ color: "var(--red, #ef4444)" }}>
                  <span style={{ fontSize: 14 }}>→</span>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
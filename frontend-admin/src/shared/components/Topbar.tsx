import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface TopbarProps {
  title: string
  subtitle?: string
}

export const Topbar = ({ title, subtitle }: TopbarProps) => {
  const [search, setSearch] = useState("")

  return (
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        borderBottom: "1px solid #1e293b",
        background: "#0f172a",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* LEFT */}
      <div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: 12,
              color: "#94a3b8",
              marginTop: 4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 10,
            padding: "8px 14px",
          }}
        >
          <span style={{ fontSize: 13, color: "#94a3b8" }}>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#f8fafc",
              fontSize: 13,
              width: 160,
            }}
          />

          <kbd
            style={{
              fontSize: 10,
              color: "#94a3b8",
              background: "#0f172a",
              padding: "2px 6px",
              borderRadius: 6,
              border: "1px solid #334155",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          type="button"
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#1e293b",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 15,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#334155")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#1e293b")
          }
        >
          🔔
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6366f1",
            }}
          />
        </button>

        {/* Avatar */}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
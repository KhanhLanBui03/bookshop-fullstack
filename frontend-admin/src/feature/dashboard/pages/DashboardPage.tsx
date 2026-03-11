import React, { useEffect, useState } from "react"
import type { StatsDashboardResponse, TopBookResponse, TopRecentOrder } from "../dashboard.type"
import { dashboardApi } from "@/api/dashboard.api"



const WEEKLY = [
  { day: "Mon", rev: 5200 },
  { day: "Tue", rev: 7800 },
  { day: "Wed", rev: 4600 },
  { day: "Thu", rev: 9100 },
  { day: "Fri", rev: 8300 },
  { day: "Sat", rev: 11200 },
  { day: "Sun", rev: 6700 },
]

const CATEGORIES = [
  { name: "Fiction", value: 35, color: "var(--accent)" },
  { name: "Self-Help", value: 22, color: "var(--green)" },
  { name: "Technology", value: 18, color: "var(--blue)" },
  { name: "Business", value: 14, color: "var(--amber)" },
  { name: "Other", value: 11, color: "var(--red)" },
]

/* ════════ CSS ════════ */
const CSS = `
  .db * { box-sizing: border-box; margin: 0; padding: 0; }

  .db {
    font-family: var(--font-body);
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
  }

  @keyframes up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .up { animation: up .3s cubic-bezier(.22,1,.36,1) both; }

  .db-stat:hover {
    border-color: rgba(255,255,255,0.15) !important;
    transform: translateY(-2px);
  }
  .db-row:hover  { background: rgba(255,255,255,0.03) !important; }
  .db-bar:hover .db-bf { background: var(--accent) !important; }
`

/* ════════ SHARED ════════ */
const glass: React.CSSProperties = {
  background: "var(--bg3)",
  border: "1px solid var(--border)",
  borderRadius: 14,
}

const div6 = "1px solid var(--border)"

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
}

/* Status badge styles using GlobalStyles tokens */
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "rgba(255,107,53,0.15)", color: "var(--accent)" },
  Pending: { bg: "rgba(245,158,11,0.15)", color: "var(--amber)" },
  Cancelled: { bg: "rgba(255,255,255,0.06)", color: "var(--muted2)" },
}

/* ════════ PAGE ════════ */
export const DashboardPage = () => {
  const maxRev = Math.max(...WEEKLY.map(w => w.rev))
  const [hover, setHover] = useState<number | null>(null)
  const [stats, setStats] = useState<StatsDashboardResponse | null>(null)
  const [orders, setOrders] = useState<TopRecentOrder[]>([])
  const [books, setBooks] = useState<TopBookResponse[]>([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const [books, orders, stats] = await Promise.all([
        dashboardApi.getTopBook(),
        dashboardApi.getTopRecentOrder(),
        dashboardApi.getDashboardStats()
      ])

      setBooks(books)
      setOrders(orders)
      setStats(stats)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  fetchDashboard()
}, [])
  const statsData = stats
    ? [
      { label: "Revenue", value: `$${stats.revenue}`, trend: "", up: true },
      { label: "Orders", value: stats.orders, trend: "", up: true },
      { label: "Books Sold", value: stats.bookSold, trend: "", up: true },
      { label: "Customers", value: stats.customers, trend: "", up: true },
    ]
    : []
  return (
    <div className="db">
      <style>{CSS}</style>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 28px" }}>

        {/* ── Header ── */}
        <div className="up" style={{ marginBottom: 28 }}>
          <p style={{ ...mono, fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
            Sat, 28 Feb 2026
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "var(--text)",
          }}>
            Dashboard
          </h1>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
          {statsData.map((s, i) => (
            <div
              key={i}
              className="db-stat up"
              style={{
                ...glass,
                padding: "18px 20px",
                animationDelay: `${i * 50}ms`,
                transition: "border-color .2s ease, transform .2s ease",
                cursor: "default",
              }}
            >
              <p style={{
                ...mono,
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 10,
              }}>
                {s.label}
              </p>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-1px",
                marginBottom: 8,
                color: "var(--text)",
              }}>
                {s.value}
              </p>
              <span style={{ ...mono, fontSize: 11, color: s.up ? "var(--green)" : "var(--red)" }}>
                {s.trend}
              </span>
            </div>
          ))}
        </div>

        {/* ── Weekly Revenue + Category Breakdown ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>

          {/* Weekly chart */}
          <div className="up" style={{ ...glass, padding: "20px 22px", animationDelay: "200ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{
                  ...mono,
                  fontSize: 10,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  marginBottom: 4,
                }}>
                  Weekly Revenue
                </p>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  color: "var(--text)",
                }}>
                  ${WEEKLY.reduce((a, w) => a + w.rev, 0).toLocaleString()}
                </p>
              </div>
              <span style={{ ...mono, fontSize: 11, color: "var(--green)" }}>↑ 9.3%</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
              {WEEKLY.map((w, i) => {
                const h = (w.rev / maxRev) * 100
                const active = hover === i
                return (
                  <div
                    key={i}
                    className="db-bar"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      flex: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 6,
                      cursor: "default",
                    }}
                  >
                    <div
                      className="db-bf"
                      style={{
                        width: "100%",
                        height: `${h}%`,
                        minHeight: 4,
                        borderRadius: "3px 3px 0 0",
                        background: active ? "var(--accent)" : "rgba(255,107,53,0.25)",
                        transition: "background .12s",
                        position: "relative",
                      }}
                    >
                      {active && (
                        <div style={{
                          position: "absolute",
                          top: -22,
                          left: "50%",
                          transform: "translateX(-50%)",
                          ...mono,
                          fontSize: 9,
                          color: "var(--accent)",
                          whiteSpace: "nowrap",
                          background: "rgba(255,107,53,0.15)",
                          padding: "2px 5px",
                          borderRadius: 4,
                        }}>
                          ${(w.rev / 1000).toFixed(1)}k
                        </div>
                      )}
                    </div>
                    <span style={{
                      ...mono,
                      fontSize: 9,
                      color: active ? "var(--text)" : "var(--muted)",
                    }}>
                      {w.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="up" style={{ animationDelay: "240ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Sales by Category
              </h2>
            </div>

            <div style={{ ...glass, padding: "20px 18px" }}>
              {CATEGORIES.map((c, i) => (
                <div key={i} style={{ marginBottom: i < CATEGORIES.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--muted2)" }}>{c.name}</span>
                    <span style={{ ...mono, fontSize: 11, color: "var(--text)" }}>{c.value}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--border2)", borderRadius: 99 }}>
                    <div style={{
                      height: "100%",
                      width: `${c.value}%`,
                      background: c.color,
                      borderRadius: 99,
                      transition: "width .3s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Orders + Top Books ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Orders */}
          <div className="up" style={{ animationDelay: "280ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Recent Orders
              </h2>
              <span style={{ fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>View all →</span>
            </div>
            <div style={{ ...glass, overflow: "hidden" }}>
              {orders.map((o, i) => {
                const s = STATUS_STYLE[o.orderStatus] || STATUS_STYLE["Cancelled"]
                return (
                  <div
                    key={o.id}
                    className="db-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 16px",
                      borderBottom: i < orders.length - 1 ? div6 : "none",
                      transition: "background .1s ease",
                    }}
                  >
                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "rgba(255,107,53,0.12)",
                      border: "1px solid rgba(255,107,53,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}>
                      {o.fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>
                        {o.fullName}
                      </p>
                      <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{o.orderDate}</p>
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 7px",
                      borderRadius: 99,
                      background: s.bg,
                      color: s.color,
                      whiteSpace: "nowrap",
                    }}>
                      {o.orderStatus}
                    </span>
                    <span style={{ ...mono, fontSize: 13, fontWeight: 600, flexShrink: 0, color: "var(--text)" }}>
                      ${o.orderTotalAmount}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Books */}
          <div className="up" style={{ animationDelay: "320ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                Top Books
              </h2>
              <span style={{ fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>Catalog →</span>
            </div>
            <div style={{ ...glass, overflow: "hidden" }}>
              {books?.map((b, i) => {
                const isLow = b.stock > 0 && b.stock <= 10
                const isOut = b.stock === 0
                return (
                  <div
                    key={b.id}
                    className="db-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 16px",
                      borderBottom: i < books.length - 1 ? div6 : "none",
                      transition: "background .1s ease",
                    }}
                  >
                    <span style={{
                      ...mono,
                      fontSize: 11,
                      fontWeight: 700,
                      color: i === 0 ? "var(--accent)" : "var(--muted)",
                      width: 16,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>
                        {b.title}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{b.authorName}</p>
                      <div style={{ marginTop: 7, height: 3, background: "var(--border)", borderRadius: 99 }}>
                        <div style={{
                          height: "100%",
                          width: `${(b.sold / Math.max(...books.map(book => book.sold))) * 100}%`,
                          background: "rgba(255,107,53,0.5)",
                          borderRadius: 99,
                        }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {(isOut || isLow) && (
                        <span style={{
                          ...mono,
                          fontSize: 9,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 4,
                          color: isOut ? "var(--red)" : "var(--amber)",
                        }}>
                          {isOut ? "Out of stock" : `${b.stock} left`}
                        </span>
                      )}
                      <span style={{ ...mono, fontSize: 12, fontWeight: 600, color: "var(--muted2)" }}>
                        {b.sold} sold
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
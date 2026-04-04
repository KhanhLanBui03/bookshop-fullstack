import React from "react"
import { glass, mono, fmt } from "../customer.config"
import type { UserDashboardStats } from "../customer.type"

interface Props {
    stats: UserDashboardStats | null
    loading: boolean
}

const STAT_ITEMS = (stats: UserDashboardStats | null) => [
    { label: "Total Customers", value: stats ? String(stats.totalCustomers) : null, icon: "👥", color: "var(--text)" },
    { label: "Total Revenue", value: stats ? fmt(stats.totalRevenue) : null, icon: "💰", color: "var(--accent,#ff6b35)" },
    { label: "Total Orders", value: stats ? String(stats.totalOrders) : null, icon: "📦", color: "#60a5fa" },
    { label: "New This Month", value: stats ? String(stats.newThisMonth) : null, icon: "✨", color: "#22c55e" },
]

export const CustomerStatsGrid = ({ stats, loading }: Props) => (
    <div
        className="cm-up"
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginBottom: 20,
            animationDelay: "40ms",
        }}
    >
        {STAT_ITEMS(stats).map((s, i) => (
            <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div>
                    <p style={{
                        ...mono, fontSize: 10, color: "var(--muted)",
                        textTransform: "uppercase", letterSpacing: 1, marginBottom: 4,
                    }}>
                        {s.label}
                    </p>
                    {loading || s.value == null ? (
                        <div className="cm-skeleton" style={{ height: 28, width: 70, marginBottom: 4 }} />
                    ) : (
                        <p style={{
                            fontFamily: "var(--font-display,'Fraunces',serif)",
                            fontSize: 22, fontWeight: 700, color: s.color,
                        }}>
                            {s.value}
                        </p>
                    )}
                </div>
            </div>
        ))}
    </div>
)
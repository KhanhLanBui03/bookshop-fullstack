import React from "react"
import { ShieldCheck, Siren, TriangleAlert } from "lucide-react"
import { glass, mono } from "../book.config"
import type { BookDashboardStats } from "../book.type"

interface Props {
    stats: BookDashboardStats | null
}

export const BookStatsGrid = ({ stats }: Props) => {
    const items = [
        { label: "Total Books", value: stats?.totalBooks ?? "—", icon: "📚" },
        { label: "Active", value: stats?.countActive ?? "—", icon: <ShieldCheck size={20} /> },
        { label: "Low Stock", value: stats?.countLowStock ?? "—", icon: <TriangleAlert size={20} /> },
        { label: "Out of Stock", value: stats?.countOutOfStock ?? "—", icon: <Siren size={20} /> },
    ]

    return (
        <div
            className="bm-up"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
                marginBottom: 20,
                animationDelay: "40ms",
            }}
        >
            {items.map((s, i) => (
                <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 22, color: "var(--muted2)" }}>{s.icon}</span>
                    <div>
                        <p style={{
                            ...mono, fontSize: 10, color: "var(--muted)",
                            textTransform: "uppercase", letterSpacing: 1, marginBottom: 4,
                        }}>
                            {s.label}
                        </p>
                        <p style={{
                            fontFamily: "var(--font-display,'Fraunces',serif)",
                            fontSize: 22, fontWeight: 700,
                        }}>
                            {s.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
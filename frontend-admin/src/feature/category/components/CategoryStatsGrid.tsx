import { glass, mono } from "../category.config"
import type { CategoryStats } from "../category.type"

interface Props {
    stats: CategoryStats | null
    loading: boolean
}

export const CategoryStatsGrid = ({ stats, loading }: Props) => {
    const items = [
        { label: "Total Categories", value: stats?.totalCategories, icon: "🗂️", color: "var(--text,#e8e4f0)" },
        { label: "Total Books", value: stats?.totalBooks, icon: "📚", color: "var(--accent,#ff6b35)" },
        { label: "Avg Books / Cat", value: stats?.avgBooksPerCategory != null ? stats.avgBooksPerCategory.toFixed(1) : null, icon: "📊", color: "#60a5fa" },
        { label: "Empty Categories", value: stats?.emptyCategories, icon: "📭", color: "#f59e0b" },
    ]

    return (
        <div className="cat-up" style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: 12, marginBottom: 20, animationDelay: "40ms",
        }}>
            {items.map((s, i) => (
                <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted,#6b6880)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                            {s.label}
                        </p>
                        {loading || s.value == null ? (
                            <div className="cat-skeleton" style={{ height: 26, width: 64 }} />
                        ) : (
                            <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 22, fontWeight: 700, color: s.color }}>
                                {s.value}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
import type { BadgeLabel, StatusConfig } from "../order.types";

const STATUS_CONFIG: Record<BadgeLabel, StatusConfig> = {
    Delivered: { bg: "rgba(34,197,94,0.12)", color: "#4ade80", dot: "#22c55e" },
    Processing: { bg: "rgba(96,165,250,0.12)", color: "#93c5fd", dot: "#60a5fa" },
    Shipped: { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd", dot: "#a78bfa" },
    Pending: { bg: "rgba(245,158,11,0.12)", color: "#fcd34d", dot: "#f59e0b" },
    Cancelled: { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", dot: "#ef4444" },
    "In Stock": { bg: "rgba(34,197,94,0.12)", color: "#4ade80", dot: "#22c55e" },
    "Low Stock": { bg: "rgba(245,158,11,0.12)", color: "#fcd34d", dot: "#f59e0b" },
    "Out of Stock": { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", dot: "#ef4444" },
};
interface BadgeProps { label: BadgeLabel; }
export const Badge = ({ label }: BadgeProps) => {
    const cfg = STATUS_CONFIG[label];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 9px", borderRadius: 99,
            background: cfg.bg, color: cfg.color,
            fontSize: 11, fontWeight: 500, fontFamily: "var(--font-mono)",
            whiteSpace: "nowrap",
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {label}
        </span>
    );
};
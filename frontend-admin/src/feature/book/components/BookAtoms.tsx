import React from "react"
import { mono, STATUS_CFG } from "../book.config"
import type { BookStatus } from "../book.type"

/* ── Stars ── */
const Star = ({ filled }: { filled: boolean }) => (
    <span style={{ color: filled ? "var(--amber,#f59e0b)" : "rgba(255,255,255,.15)", fontSize: 11 }}>★</span>
)
export const Stars = ({ rating }: { rating: number }) => (
    <span>{[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(rating)} />)}</span>
)

/* ── Status Badge ── */
export const StatusBadge = ({ status }: { status: BookStatus }) => {
    const cfg = STATUS_CFG[status]
    return (
        <span style={{
            ...mono, fontSize: 10, fontWeight: 600,
            padding: "3px 9px", borderRadius: 99,
            background: cfg.bg, color: cfg.color, whiteSpace: "nowrap",
        }}>
            {cfg.label}
        </span>
    )
}

/* ── Form Field wrapper ── */
export const Field = ({
    label, children, required, hint,
}: {
    label: string
    children: React.ReactNode
    required?: boolean
    hint?: string
}) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted2)", marginBottom: 6 }}>
            {label}{required && <span style={{ color: "var(--accent)" }}> *</span>}
        </label>
        {children}
        {hint && <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{hint}</p>}
    </div>
)

/* ── Inline spinner ── */
export const Spinner = ({ size = 20 }: { size?: number }) => (
    <div
        className="bm-spinner"
        style={{ width: size, height: size, borderWidth: size < 18 ? 2 : undefined }}
    />
)
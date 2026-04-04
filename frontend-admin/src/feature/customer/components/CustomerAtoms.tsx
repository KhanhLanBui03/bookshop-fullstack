import React from "react"
import { avatarColor, initials, mono, ROLE_CFG } from "../customer.config"
import type { RoleName } from "../customer.type"

/* ── Avatar ── */
export const Avatar = ({
    name,
    id,
    size = 36,
}: {
    name: string
    id: number
    size?: number
}) => {
    const color = avatarColor(id)
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", flexShrink: 0,
            background: color + "28", border: `2px solid ${color}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...mono, fontSize: size * 0.33, fontWeight: 700, color,
        }}>
            {initials(name)}
        </div>
    )
}

/* ── Role Badge ── */
export const RoleBadge = ({ role }: { role: string }) => {
    const cfg = ROLE_CFG[role as RoleName] ?? {
        label: role,
        bg: "rgba(255,255,255,0.07)",
        color: "var(--muted2)",
    }
    return (
        <span style={{
            ...mono, fontSize: 9, fontWeight: 700,
            padding: "2px 7px", borderRadius: 99,
            background: cfg.bg, color: cfg.color,
        }}>
            {cfg.label}
        </span>
    )
}

/* ── Section Title ── */
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        ...mono, fontSize: 10, color: "var(--muted)",
        textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12,
    }}>
        {children}
    </p>
)